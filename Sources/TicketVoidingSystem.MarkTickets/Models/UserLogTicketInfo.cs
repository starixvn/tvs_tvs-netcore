namespace TicketVoidingSystem.MarkTickets.Models
{
    using System.Collections.Generic;

    public class UserLogTicketInfo
    {
        public IEnumerable<TicketInfo> SingleTickets { get; set; }
        public IEnumerable<TicketInfo> ParlayTickets { get; set; }
    }
}