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
        if (AppSettingService.AppSetting.LetstalkConfig.IsProdEnv)
        {
            return ticket.IsCashOut && ticket.Currency != Currency20;
        }
        return ticket.IsCashOut;
    }

    public bool IsValidSettledSingleTicket(TicketEmailModel ticket)
    {
        var result = !ticket.BetTypeId.IsParlayAndBetBuilder()
                     && !ticket.IsCashOut
                     && ticket.Status.IsSettled();
        if (AppSettingService.AppSetting.LetstalkConfig.IsProdEnv)
        {
            return result && ticket.Currency != Currency20;
        }
        return result;
    }

    public bool IsValidSettledParlayTicket(TicketEmailModel ticket, bool isCheckMainParlay)
    {
        var result = isCheckMainParlay ? ticket.BetTypeId.IsParlayAndBetBuilder() && ticket.Status.IsSettled()
            : ticket.IsMixParlay && ticket.SubStatus.IsSettled();
        if (AppSettingService.AppSetting.LetstalkConfig.IsProdEnv)
        {
            return result && ticket.Currency != Currency20;
        }
        return result;
    }
}