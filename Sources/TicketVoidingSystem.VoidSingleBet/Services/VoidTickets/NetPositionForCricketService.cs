using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.NetPosition;
using TicketVoidingSystem.Utilities;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;

namespace TicketVoidingSystem.VoidSingleBet.Services.VoidTickets;

public interface NetPositionForCricketService
{
    Task<(string WarningCricket, IEnumerable<BetId> TicketsAfterUpdateNp)> Update(VoidTicketsQuery query);

    Task Rollback(string transIdCrickets, VoidTicketsModel voidResult);
}

public class NetPositionForCricketServiceImp : NetPositionForCricketService
{
    private readonly NetPositionService netPositionService;

    public NetPositionForCricketServiceImp(NetPositionService netPositionService)
    {
        this.netPositionService = netPositionService;
    }

    public async Task<(string WarningCricket, IEnumerable<BetId> TicketsAfterUpdateNp)> Update(VoidTicketsQuery query)
    {
        var isSuccessfullyUpdateNetPosition = await netPositionService.UpdateNetPosition(query.TransIdCrickets, NetPositionConstant.ActionVoid);
        if (!isSuccessfullyUpdateNetPosition)
        {
            var warningCricket = Helper.MessageFailApiCricket(query.TransIdCrickets, NetPositionConstant.ActionVoid);
            var ticketsAfterRemoveCricket = query.Tickets.Where(x => !query.TransIdCrickets.Split(',').Contains(x.TransId));

            return (warningCricket, ticketsAfterRemoveCricket);
        }

        return (string.Empty, query.Tickets);
    }

    public async Task Rollback(string transIdCrickets, VoidTicketsModel voidResult)
    {
        if (voidResult.IsNeedToRollBackNetPosition)
        {
            await netPositionService.RollBackNetPosition(transIdCrickets, NetPositionConstant.ActionVoid, voidResult.Validation.ErrorMsg);
        }
    }
}