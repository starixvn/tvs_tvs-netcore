using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Services.VoidTickets;

namespace TicketVoidingSystem.VoidSingleBet.Handlers;

public class VoidTicketsRequest : VoidTicketsQuery, IRequest<IEnumerable<Result>?>
{
}

public class VoidTicketsHandler : IRequestHandler<VoidTicketsRequest, IEnumerable<Result>?>
{
    private readonly VoidResultCacheService voidResultCacheService;
    private readonly NetPositionForCricketService netPositionForCricketService;
    private readonly VoidTicketsService voidTicketsService;
    private readonly AfterVoidService afterVoidService;

    public VoidTicketsHandler(VoidResultCacheService voidResultCacheService, NetPositionForCricketService netPositionForCricketService,
        VoidTicketsService voidTicketsService, AfterVoidService afterVoidService)
    {
        this.voidResultCacheService = voidResultCacheService;
        this.netPositionForCricketService = netPositionForCricketService;
        this.voidTicketsService = voidTicketsService;
        this.afterVoidService = afterVoidService;
    }

    public async Task<IEnumerable<Result>?> Handle(VoidTicketsRequest request, CancellationToken cancellationToken)
    {
        if (await voidResultCacheService.IsExistVoidResult(request.Guid))
        {
            return null;
        }

        return await HandleWhenRequestValid(request);
    }

    // Jacob. xài yield
    private async Task<IEnumerable<Result>> HandleWhenRequestValid(VoidTicketsQuery query)
    {
        var results = new List<Result>();
        await voidResultCacheService.SetVoidResultCache(query.Guid, results);

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
            await netPositionForCricketService.Rollback(query.TransIdCrickets, voidResult);
        }

        await voidResultCacheService.SetVoidResultCache(query.Guid, results);

        return results;
    }
}