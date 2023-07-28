using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendMessage;

namespace TicketVoidingSystem.VoidSingleBet.Criteria;

public class VoidTicketsQuery : CommonQuery
{
    public string Guid { get; set; }

    public string UserName { get; set; }

    public string UserPassword { get; set; }

    public IEnumerable<BetId> Tickets { get; set; }

    public IEnumerable<BetId> TransIdCrickets { get; set; }

    public string Reason { get; set; }

    public string ReasonSc { get; set; }

    public Message Message { get; set; }

    public Match Match { get; set; }
}