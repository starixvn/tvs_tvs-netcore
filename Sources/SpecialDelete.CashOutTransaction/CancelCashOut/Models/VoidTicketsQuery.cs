using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendMessage;

namespace SpecialDelete.CashOutTransaction.CancelCashOut.Models;

public class VoidTicketsQuery
{
    public IEnumerable<BetId> Tickets { get; set; }

    public string UserName { get; set; }

    public string UserPassword { get; set; }

    public string Reason { get; set; }

    public string ReasonSC { get; set; }

    public Message Message { get; set; }

    public Match Match { get; set; }

    public string NegativeBalanceUsers { get; set; }
}