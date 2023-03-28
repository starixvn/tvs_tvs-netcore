using System.Collections.Generic;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;

public class MarkTicketsQuery
{
    public byte Status { get; set; }

    public IEnumerable<BetId> Tickets { get; set; }
}