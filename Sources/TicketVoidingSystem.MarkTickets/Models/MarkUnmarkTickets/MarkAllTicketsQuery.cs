using System.Collections.Generic;

namespace TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;

public class MarkAllTicketsQuery
{
    public IEnumerable<MarkedMatchXmlModel> Matches { get; set; }
}