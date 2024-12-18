using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Services.VoidTickets;

namespace TicketVoidingSystem.VoidSingleBet.Handlers;

public class VoidTicketsRequest : VoidTicketsQuery, IRequest<IEnumerable<Result>?>;

public class VoidTicketsHandler(
    ResultCacheService resultCacheService,
    NetPositionForCricketService netPositionForCricketService,
    VoidTicketsService voidTicketsService,
    AfterVoidService afterVoidService)
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
        await resultCacheService.SetVoidResultsCache(query.Guid, results);

        var updateNpResult = await netPositionForCricketService.Update(query);
        if (!updateNpResult.TicketsAfterUpdateNp.Any())
        {
            results.Add(new Result { ErrorCode = ErrorCode.ExecuteQueryAPIFail, ErrorMsg = updateNpResult.WarningCricket });
        }
        else
        {
            query.Tickets = updateNpResult.TicketsAfterUpdateNp;
            var voidResult = await voidTicketsService.VoidBet(query);
            results.AddRange(await afterVoidService.ExecuteWhenVoidSuccess(query, voidResult, updateNpResult.WarningCricket));
            results.AddRange(afterVoidService.ExecuteWhenVoidFailed(voidResult));
            await netPositionForCricketService.Rollback(voidResult);
        }

        await resultCacheService.SetVoidResultsCache(query.Guid, results);

        return results;
    }
}