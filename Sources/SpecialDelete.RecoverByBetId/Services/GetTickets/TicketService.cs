using SpecialDelete.RecoverByBetId.Models;
using SpecialDelete.RecoverByBetId.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.RecoverByBetId.Services.GetTickets;

public interface TicketService
{
    TicketViewModel GetTicket(GetTicketModel item, ChoiceType choiceType);
}

public class TicketServiceImp(BetListRecoverBetIdService betListService) : TicketService
{
    public TicketViewModel GetTicket(GetTicketModel item, ChoiceType choiceType)
    {
        var ticket = betListService.GetTicket(item, choiceType);
        ticket.BetId = item.TransId.ToString();
        ticket.Member = item.UserName;
        ticket.TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        ticket.WinLoss = item.Status.IsRunningOrWaiting() ? "-" : Convert.ToDecimal(item.WinLost).ToString("#,##0.##");
        ticket.Value = item.TransId.ToString();
        ticket.SiteDbGroupId = item.SiteDbGroupId;

        return ticket;
    }
}