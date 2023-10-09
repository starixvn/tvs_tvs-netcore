using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverByBetId.Models;

public class GetTicketsQuery
{
    public string TransIds { get; set; }
}

public class RecoverTicketsQuery
{
    public string NegativeBalanceUsers { get; set; }

    public IEnumerable<BetId> Tickets { get; set; }
}