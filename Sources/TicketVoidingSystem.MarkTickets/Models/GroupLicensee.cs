using System.Collections.Generic;

namespace TicketVoidingSystem.MarkTickets.Models
{
    public class GroupLicensee
    {
        public string GroupName { get; set; }

        public IEnumerable<Licensee> Licensees { get; set; }
    }
}