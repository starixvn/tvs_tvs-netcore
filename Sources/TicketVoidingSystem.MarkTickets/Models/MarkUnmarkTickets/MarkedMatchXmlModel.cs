using System;

namespace TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets
{
    public class MarkedMatchXmlModel
    {
        public int MatchId { get; set; }

        public int UserId { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}