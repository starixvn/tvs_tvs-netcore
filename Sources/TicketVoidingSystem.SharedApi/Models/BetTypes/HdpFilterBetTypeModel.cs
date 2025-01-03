using System.Collections.Generic;

namespace TicketVoidingSystem.SharedApi.Models.BetTypes;

public class HdpFilterBetTypeModel
{
    public List<BetTypeFilterHdpModel> BetTypes { get; set; }
}

public class BetTypeFilterHdpModel
{
    public string Name { get; set; }
    public List<Selection> Selections { get; set; }
    public int IssueType { get; set; }
    public string Sports { get; set; }
    public string BetType { get; set; }
}