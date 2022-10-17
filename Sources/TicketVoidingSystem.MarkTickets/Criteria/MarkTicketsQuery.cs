using System.Collections.Generic;
using SpecialDelete.Core.DTO;

namespace TicketVoidingSystem.MarkTickets.Criteria
{
    public class MarkTicketsQuery
    {
        public byte Status { get; set; }

        public IEnumerable<BetId> Tickets { get; set; }
    }
}