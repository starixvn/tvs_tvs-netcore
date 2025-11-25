namespace SpecialDelete.RecoverParlayBet.Models;

public class GetSubTicket : GetMainTicket
{
    public decimal SubOdds { get; set; }

    public string SubBetCheck { get; set; }

    public string SubBetTeam { get; set; }

    public decimal SubHdp1 { get; set; }

    public int SubBetType { get; set; }

    public decimal SubHdp2 { get; set; }

    public short SubLiveAwayScore { get; set; }

    public int SubLeagueId { get; set; }

    public short SubLiveHomeScore { get; set; }

    public long SubHomeId { get; set; }

    public string SubTransDesc { get; set; }

    public long SubAwayId { get; set; }

    public int SubSportType { get; set; }

    public bool SubLiveIndicator { get; set; }

    public decimal SubOddsSpread { get; set; }

    public decimal FinalOdds { get; set; }
}