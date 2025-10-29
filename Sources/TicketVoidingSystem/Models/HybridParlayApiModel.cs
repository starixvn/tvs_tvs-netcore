using System.Collections.Generic;

namespace TicketVoidingSystem.Models;

public class HybridParlayApiModel
{
    public IEnumerable<HybridParlayVoidBetInfo> VoidBetInfos { get; set; }
}

public class HybridParlayVoidBetInfo
{
    public BetModel Bet { get; set; }
    public IEnumerable<LegModel> Legs { get; set; }
}

public class BetModel
{
    public string TransId { get; set; }
    public int CustId { get; set; }
}

public class LegModel
{
    public WayModel Way { get; set; }
    public MarketModel Market { get; set; }
}

public class WayModel
{
    public string Id { get; set; }
}

public class MarketModel
{
    public int MatchId { get; set; }
    public string MarketId { get; set; }
}