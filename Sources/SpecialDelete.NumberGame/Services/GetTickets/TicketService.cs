using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.NumberGame.Services.GetTickets;

public interface TicketService
{
    TicketViewModel GetTicket(GetTicketModel item, bool isDisable, bool isRecover);

    TicketViewModel GetTicket(GetTicketModel item, bool isRecover);
}

public class TicketServiceImp(BetListCoreService betListCoreService) : TicketService
{
    public TicketViewModel GetTicket(GetTicketModel item, bool isDisable, bool isRecover)
    {
        var ticket = GetTicket(item, isRecover);
        ticket.IsDisable = isDisable;
        return ticket;
    }

    public TicketViewModel GetTicket(GetTicketModel item, bool isRecover)
    {
        var ticket = betListCoreService.GetTicket(item, isRecover);
        ticket.BetId = item.TransId.ToString();
        ticket.Member = item.UserName;
        ticket.TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        ticket.CurrencyName = item.CurrencyName;
        ticket.Status = item.Status;
        ticket.Creator = item.Creator;
        ticket.BallSequence = item.BallSequence;
        ticket.SiteDbGroupId = item.SiteDbGroupId;
        ticket.WinLost = GetWinLost(item, isRecover);

        return ticket;
    }

    private static string GetWinLost(GetTicketModel item, bool isRecover)
    {
        if (item.Status.IsRunningOrWaiting())
        {
            return "-";
        }

        var winLost = Convert.ToDecimal(item.WinLost).ToString("#,##0.##");
        if (isRecover)
        {
            return winLost;
        }

        var comm = item.Comm.ToString("0.##");
        return $"{winLost}<br>{comm}";
    }
}