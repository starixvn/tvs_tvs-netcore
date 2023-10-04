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

public class TicketServiceImp : TicketService
{
    private readonly BetListCoreService betListCoreService;

    public TicketServiceImp(BetListCoreService betListCoreService)
    {
        this.betListCoreService = betListCoreService;
    }

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
        var winLostByRecover = isRecover ? Convert.ToDecimal(item.WinLost).ToString("#,##0.##") : Convert.ToDecimal(item.WinLost).ToString("#,##0.##") + "<br>" + item.Comm.ToString("0.##");
        ticket.WinLost = item.Status.IsRunningOrWaiting() ? "-" : winLostByRecover;

        return ticket;
    }
}