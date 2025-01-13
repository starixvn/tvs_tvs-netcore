using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

public interface GetTicketsViewModelService
{
    public short GetGroupPhAffected(IEnumerable<GetTicketModel> data);

    public TicketsByGroupInRequest GetTicketsByGroup(IEnumerable<GetTicketModel> allTickets);

    public TicketsByGroupInRequest GetValidTickets(TicketsByGroupInRequest ticketsInRequest, VoidPermission permission, int issueTypeId);
}

public class GetTicketsViewModelServiceImp : GetTicketsViewModelService
{
    public short GetGroupPhAffected(IEnumerable<GetTicketModel> data)
    {
        var isHasTicketPh1X2Affected = data.Any(x => x.GroupPHAffected == 1);
        var isHasTicketPhAioAffected = data.Any(x => x.GroupPHAffected == 2);
        return isHasTicketPh1X2Affected switch
        {
            true when isHasTicketPhAioAffected => GroupPHAffectedConstant.Group1X2AndAIO,
            true => GroupPHAffectedConstant.Group1X2,
            _ => isHasTicketPhAioAffected ? GroupPHAffectedConstant.GroupAIO : (short)0
        };
    }

    public TicketsByGroupInRequest GetTicketsByGroup(IEnumerable<GetTicketModel> allTickets)
    {
        return new TicketsByGroupInRequest
        {
            SingleTickets = allTickets.Where(item => !item.IsMixParlay && !item.IsCricket && !item.IsCancelCashOut),
            ParlayTickets = allTickets.Where(item => item.IsMixParlay && !item.IsCricket && !item.IsCancelCashOut),
            CricketTickets = allTickets.Where(item => item.IsCricket),
            CancelCashOutTickets = allTickets.Where(item => item.IsCancelCashOut)
        };
    }

    public TicketsByGroupInRequest GetValidTickets(TicketsByGroupInRequest ticketsInRequest, VoidPermission permission, int issueTypeId)
    {
        var enableSingle = ticketsInRequest.SingleTickets.Where(x => !x.IsDisable(permission, issueTypeId));
        var disableBonusSingle = ticketsInRequest.SingleTickets.Where(x => x.IsDisable(permission, issueTypeId) && x.WalletType > 0);
        var validVoidSingleTickets = enableSingle.Concat(disableBonusSingle);
        var validVoidParlayTickets = ticketsInRequest.ParlayTickets.Where(x => !x.IsDisable(permission, issueTypeId));
        var enableCricket = ticketsInRequest.CricketTickets.Where(x => !x.IsDisable(permission, issueTypeId));
        var disableBonusCricket = ticketsInRequest.CricketTickets.Where(x => x.IsDisable(permission, issueTypeId) && x.WalletType > 0);
        var validVoidCricketTickets = enableCricket.Concat(disableBonusCricket);
        var validCancelCashOutTickets = ticketsInRequest.CancelCashOutTickets.Where(x => !x.IsDisable(permission, issueTypeId));

        return new TicketsByGroupInRequest
        {
            SingleTickets = validVoidSingleTickets,
            ParlayTickets = validVoidParlayTickets,
            CricketTickets = validVoidCricketTickets,
            CancelCashOutTickets = validCancelCashOutTickets
        };
    }
}