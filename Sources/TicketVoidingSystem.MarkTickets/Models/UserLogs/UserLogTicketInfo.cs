using System.Collections.Generic;

namespace TicketVoidingSystem.MarkTickets.Models.UserLogs;

public class UserLogTicketInfo
{
    public IEnumerable<TicketInfo> SingleTickets { get; set; }
    public IEnumerable<TicketInfo> ParlayTickets { get; set; }
    public IEnumerable<TicketInfo> HybridParlayTickets { get; set; }
}