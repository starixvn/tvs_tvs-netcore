using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;

public interface UusTicketService
{
    bool IsValidCashOut(TicketEmailModel ticket);

    bool IsValidSettledSingleTicket(TicketEmailModel ticket);

    bool IsValidSettledParlayTicket(TicketEmailModel ticket, bool isCheckMainParlay);
}

public class UusTicketServiceImp : UusTicketService
{
    private const int Currency20 = 20;

    public bool IsValidCashOut(TicketEmailModel ticket)
    {
        return (AppSettingService.AppSetting.LetstalkConfig.IsProdEnv) 
            ? ticket.IsCashOut && ticket.Currency 
            != Currency20 : ticket.IsCashOut;
    }

    public bool IsValidSettledSingleTicket(TicketEmailModel ticket)
    {
        var result = !ticket.BetTypeId.IsParlayAndBetBuilder()
                     && !ticket.IsCashOut
                     && ticket.Status.IsSettled();
        return (AppSettingService.AppSetting.LetstalkConfig.IsProdEnv)
            ? result && ticket.Currency != Currency20 : result;
    }

    public bool IsValidSettledParlayTicket(TicketEmailModel ticket, bool isCheckMainParlay)
    {
        var result = isCheckMainParlay ? ticket.BetTypeId.IsParlayAndBetBuilder() && ticket.Status.IsSettled()
            : ticket.IsMixParlay && ticket.SubStatus.IsSettled();
        return (AppSettingService.AppSetting.LetstalkConfig.IsProdEnv)
            ? result && ticket.Currency != Currency20 : result;
    }
}