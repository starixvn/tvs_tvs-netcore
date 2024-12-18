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

    Task Rollback(VoidTicketsModel voidResult);
}

public class NetPositionForCricketServiceImp(NetPositionService netPositionService) : NetPositionForCricketService
{
    public async Task<(string WarningCricket, IEnumerable<BetId> TicketsAfterUpdateNp)> Update(VoidTicketsQuery query)
    {
        var isSuccessfully = await netPositionService.UpdateNetPosition(query.TransIdCrickets, NetPositionConstant.ActionVoid);
        if (!isSuccessfully)
        {
            var warningCricket = Helper.MessageFailApiCricket(query.TransIdCrickets, NetPositionConstant.ActionVoid);
            var ticketsAfterRemoveCricket = query.Tickets.Where(x => query.TransIdCrickets.All(y => y.TransId != x.TransId));

            return (warningCricket, ticketsAfterRemoveCricket);
        }

        return (string.Empty, query.Tickets);
    }

    public async Task Rollback(VoidTicketsModel voidResult)
    {
        await netPositionService.RollBackNetPosition(voidResult.TicketsRollbackNetPosition);
    }
}