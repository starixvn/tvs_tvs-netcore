using TicketVoidingSystem.Models;

namespace SpecialDelete.CashOutTransaction.RecoverTickets.Models;

public class RecoverTicketsQuery
{
    public IEnumerable<BetId> Tickets { get; set; }

    public string NegativeBalanceUsers { get; set; }
}