using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.RecoverParlayBet.Services.GetTickets;

public interface DisplayedTicketService<in T> where T : GetMainTicket
{
    TicketViewModel Map(T item, bool isOnlyReadPermission);
}

public class DisplayedTicketServiceImp<T> : DisplayedTicketService<T> where T : GetMainTicket
{
    private readonly BetListParlayService<T> betListParlayService;

    public DisplayedTicketServiceImp(BetListParlayService<T> betListParlayService)
    {
        this.betListParlayService = betListParlayService;
    }

    public TicketViewModel Map(T item, bool isOnlyReadPermission)
    {
        var ticket = betListParlayService.Map(item, isOnlyReadPermission);
        ticket.BetId = item.TransId.ToString();
        ticket.Player = item.Username;
        ticket.TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        ticket.WinLost = item.Status.IsRunningOrWaiting() ? "-" : Convert.ToDecimal(item.WinLost).ToString("#,##0.##");
        ticket.Status = item.Status;
        ticket.SiteDbGroupId = item.SiteDbGroupId;

        return ticket;
    }
}