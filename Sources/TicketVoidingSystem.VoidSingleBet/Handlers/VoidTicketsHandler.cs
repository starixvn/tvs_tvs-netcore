using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeHybridParlay;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Services.VoidTickets;

namespace TicketVoidingSystem.VoidSingleBet.Handlers;

public class VoidTicketsRequest : VoidTicketsQuery, IRequest<IEnumerable<Result>?>;

public class VoidTicketsHandler(
    ResultCacheService resultCacheService,
    NetPositionForCricketService netPositionForCricketService,
    VoidTicketsService voidTicketsService,
    AfterVoidService afterVoidService,
    HybridParlayTicketService hybridParlayTicketService)
    : IRequestHandler<VoidTicketsRequest, IEnumerable<Result>?>
{
    public async Task<IEnumerable<Result>?> Handle(VoidTicketsRequest request, CancellationToken cancellationToken)
    {
        if (await resultCacheService.IsExistResult(request.Guid))
        {
            return null;
        }

        return await HandleWhenRequestValid(request);
    }

    private async Task<IEnumerable<Result>> HandleWhenRequestValid(VoidTicketsQuery query)
    {
        var results = new List<Result>();
        var isCalledJackTimeHybridParlay = false;
        var hybridParlayTickets = query.Tickets.Union(query.TransIdCrickets).Where(t => t.IsHybrid);
        await resultCacheService.SetVoidResultsCache(query.Guid, results);
        if (hybridParlayTickets.Any())
        {
            isCalledJackTimeHybridParlay = await hybridParlayTicketService.Execute(hybridParlayTickets, true);
        }
        var updateNpResult = await netPositionForCricketService.Update(query);
        if (!updateNpResult.TicketsAfterUpdateNp.Any())
        {
            results.Add(new Result { ErrorCode = ErrorCode.ExecuteQueryAPIFail, ErrorMsg = updateNpResult.WarningCricket });
        }
        else
        {
            query.Tickets = updateNpResult.TicketsAfterUpdateNp;
            var voidResult = await voidTicketsService.VoidBet(query, isCalledJackTimeHybridParlay);
            results.AddRange(await afterVoidService.ExecuteWhenVoidSuccess(query, voidResult, updateNpResult.WarningCricket));
            results.AddRange(afterVoidService.ExecuteWhenVoidFailed(voidResult.Validation));
            await netPositionForCricketService.Rollback(voidResult);
        }

        await resultCacheService.SetVoidResultsCache(query.Guid, results);

        return results;
    }
}