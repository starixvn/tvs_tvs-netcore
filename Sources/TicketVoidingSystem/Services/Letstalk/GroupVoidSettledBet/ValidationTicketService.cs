using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;

public interface ValidationTicketService
{
    bool IsValidCashOut(TicketEmailModel ticket);

    bool IsValidSettledSingleTicket(TicketEmailModel ticket);

    bool IsValidSettledParlayTicket(TicketEmailModel ticket, bool isCheckMainParlay);
}

public class ValidationTicketServiceImp : ValidationTicketService
{
    public bool IsValidCashOut(TicketEmailModel ticket)
    {
        return ticket.IsCashOut;
    }

    public bool IsValidSettledSingleTicket(TicketEmailModel ticket)
    {
        return IsSingleTicketValid(ticket);
    }

    public bool IsValidSettledParlayTicket(TicketEmailModel ticket, bool isCheckMainParlay)
    {
        return isCheckMainParlay ? IsMainParlayTicketValid(ticket) : IsMixParlayTicketValid(ticket);
    }

    private static bool IsSingleTicketValid(TicketEmailModel ticket)
    {
        return !ticket.BetTypeId.IsParlayAndBetBuilder()
               && !ticket.IsCashOut
               && ticket.Status.IsSettled();
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