using System;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.SendEmail.Recover;

public interface RecoverTicketService
{
    TicketRecoverEmailViewModel Render(TicketRecoverEmailModel item, bool isReadOnly);

    TicketRecoverEmailViewModel Render(TicketRecoverEmailModel item);
}

public class RecoverTicketServiceImp : RecoverTicketService
{
    private readonly BetListCoreService betListService;

    public RecoverTicketServiceImp(BetListCoreService betListService)
    {
        this.betListService = betListService;
    }

    public TicketRecoverEmailViewModel Render(TicketRecoverEmailModel item, bool isReadOnly)
    {
        var ticket = Render(item);
        ticket.BetType = item.BetType;
        ticket.MainTransId = item.MainTransId.ToString();
        ticket.IsCricket = item.IsCricket;
        ticket.IsDisable = isReadOnly || item.MainTransId > 0 && item.MainTransId != item.TransId;
        return ticket;
    }

    public TicketRecoverEmailViewModel Render(TicketRecoverEmailModel item)
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