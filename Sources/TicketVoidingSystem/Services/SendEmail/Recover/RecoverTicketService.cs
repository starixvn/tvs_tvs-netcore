using System;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.SendEmail.Recover;

public interface RecoverTicketService
{
    TicketRecoverEmailViewModel Render(TicketRecoverEmailModel item);
}

public class RecoverTicketServiceImp : RecoverTicketService
{
    private readonly BetListCoreService betListService;

    public RecoverTicketServiceImp(BetListCoreService betListService)
    {
        this.betListService = betListService;
    }

    public TicketRecoverEmailViewModel Render(TicketRecoverEmailModel item)
    {
        var ticket = item.BetType.IsParlay() ? betListService.GetMainParlayTicket(item) : betListService.GetNormalTicket(item);
        ticket.SiteDbGroupId = item.SiteDbGroupId;
        ticket.BetId = item.TransId.ToString();
        ticket.Player = item.UserName;
        ticket.TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        ticket.WinLost = item.Status.IsRunningOrWaiting() ? "-" : Convert.ToDecimal(item.WinLost).ToString("#,##0.##");
        ticket.Score = betListService.GetScoreBetListUi(item.SportType, item.IsLiveIndicator, item.LiveHomeScore, item.LiveAwayScore);

        return ticket;
    }
}