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
        var result = IsSingleTicketValid(ticket);
        return ApplyCurrencyValidation(result, ticket);
    }

    public bool IsValidSettledParlayTicket(TicketEmailModel ticket, bool isCheckMainParlay)
    {
        var result = isCheckMainParlay ? IsMainParlayTicketValid(ticket) : IsMixParlayTicketValid(ticket);
        return ApplyCurrencyValidation(result, ticket);
    }

    private static bool IsSingleTicketValid(TicketEmailModel ticket)
    {
        return !ticket.BetTypeId.IsParlayAndBetBuilder()
               && !ticket.IsCashOut
               && ticket.Status.IsSettled();
    }

    private static bool ApplyCurrencyValidation(bool result, TicketEmailModel ticket)
    {
        if (AppSettingService.AppSetting.LetstalkConfig.IsProdEnv)
        {
            return result && ticket.Currency != Currency20;
        }
        return result;
    }

    private static bool IsMainParlayTicketValid(TicketEmailModel ticket)
    {
        return ticket.BetTypeId.IsParlayAndBetBuilder()
               && ticket.Status.IsSettled();
    }

    private static bool IsMixParlayTicketValid(TicketEmailModel ticket)
    {
        return ticket.IsMixParlay
               && ticket.SubStatus.IsSettled();
    }
}