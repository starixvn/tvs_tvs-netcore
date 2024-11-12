using SpecialDelete.RecoverBet.Models;
using SpecialDelete.RecoverBet.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.RecoverBet.Services.RenderTicket;

public interface ITicketService
{
    TicketViewModel Render(GetTicketModel item, bool isReadOnly);

    TicketViewModel Render(GetTicketModel item);
}

public class TicketService(IBetListCoreService betListService) : ITicketService
{
    public TicketViewModel Render(GetTicketModel item, bool isReadOnly)
    {
        var ticket = Render(item);
        ticket.BetType = item.BetType;
        ticket.MainTransId = item.MainTransId.ToString();
        ticket.IsCricket = item.IsCricket;
        ticket.IsDisable = isReadOnly || item.MainTransId > 0 && item.MainTransId != item.TransId;
        return ticket;
    }

    public TicketViewModel Render(GetTicketModel item)
    {
        var ticket = betListService.GetTicket(item);
        ticket.SiteDbGroupId = item.SiteDbGroupId;
        ticket.BetId = item.TransId.ToString();
        ticket.Player = item.UserName;
        ticket.TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        ticket.WinLost = item.Status.IsRunningOrWaiting() ? "-" : Convert.ToDecimal(item.WinLost).ToString("#,##0.##");
        ticket.Score = item.IsLiveIndicator ? $"{item.LiveHomeScore} - {item.LiveAwayScore}" : string.Empty;

        return ticket;
    }
}