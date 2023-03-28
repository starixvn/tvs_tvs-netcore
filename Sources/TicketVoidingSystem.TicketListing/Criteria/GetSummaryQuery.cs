using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.TicketListing.Criteria;

public class CommonQuery
{
    public int MatchId { get; set; }

    public string BetTypes { get; set; }

    public string SelectionType { get; set; }

    public string BallSequence { get; set; }

    public int EventType { get; set; }

    public int? LiveHomeScore { get; set; }

    public int? LiveAwayScore { get; set; }

    public DateTime? FromTransDate { get; set; }

    public DateTime? ToTransDate { get; set; }

    public byte Product { get; set; }

    public int TicketType { get; set; }

    public string Quarter { get; set; }

    public IEnumerable<BetTypeXml>? BetTeams { get; set; }

    public string SingleOrSubParlay { get; set; }

    public bool IsReSettled { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }
}

public class GetSummaryQuery : CommonQuery
{
    public int LicenseeId { get; set; }

    public int GroupBy { get; set; }
}