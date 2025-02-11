using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.RecoverParlayBet.Services.GetTickets;

public interface DisplayedTicketService<in T> where T : GetMainTicket
{
    TicketViewModel Map(T item, bool isOnlyReadPermission);
}

public class DisplayedTicketServiceImp<T>(BetListParlayService<T> betListParlayService) : DisplayedTicketService<T>
    where T : GetMainTicket
{
    public TicketViewModel Map(T item, bool isOnlyReadPermission)
    {
        var ticket = betListParlayService.Map(item, isOnlyReadPermission);
        ticket.BetId = item.TransId.ToString();
        ticket.Player = item.Username;
        ticket.TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        ticket.WinLost = GetWinLost(item);
        ticket.Status = item.Status;
        ticket.SiteDbGroupId = item.SiteDbGroupId;

        return ticket;
    }

    private static string GetWinLost(T item)
    {
        return item.Status.IsRunningOrWaiting() ? "-" : Convert.ToDecimal(item.WinLost).ToString("#,##0.##");
    }
}