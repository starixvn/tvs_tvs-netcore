using System.Collections.Generic;

namespace TicketVoidingSystem.Models.Letstalk;

public class TicketCountInfo
{
    public int SingleCount { get; set; }
    public int InstantOUCount { get; set; }
    public int CashOutCount { get; set; }
    public int ParlayCount { get; set; }

    public int OutstandingSingleCount { get; set; }
    public int OutstandingParlayCount { get; set; }
    public HashSet<string> Members { get; set; } = new();
}