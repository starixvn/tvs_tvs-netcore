using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendMessage;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Models;

public class VoidTicketsQuery
{
    public int MatchId { get; set; }

    public IEnumerable<BetId> Tickets { get; set; }

    public string UserName { get; set; }

    public string Password { get; set; }

    public string Reason { get; set; }

    public string ReasonSC { get; set; }

    public Message Message { get; set; }
}