using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverParlayBet.Models;

public class RecoverMainTicketsQuery
{
    public IEnumerable<BetId> Tickets { get; set; }
}

public class RecoverSubTicketsQuery : RecoverMainTicketsQuery
{
    public int MatchId { get; set; }
}