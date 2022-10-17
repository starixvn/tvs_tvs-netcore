namespace TicketVoidingSystem.MarkTickets.Models
{
    using System;

    public class MarkedMatchXmlModel
    {
        public int MatchId { get; set; }

        public int UserId { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
