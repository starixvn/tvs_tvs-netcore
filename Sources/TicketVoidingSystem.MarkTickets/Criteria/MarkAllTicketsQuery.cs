namespace TicketVoidingSystem.MarkTickets.Criteria
{
    using System.Collections.Generic;
    using Models;

    public class MarkAllTicketsQuery
    {
        public List<MarkedMatchXmlModel> Matches { get; set; }
    }
}
