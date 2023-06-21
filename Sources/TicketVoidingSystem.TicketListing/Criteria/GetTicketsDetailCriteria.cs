using Fanex.Data.Repository;

namespace TicketVoidingSystem.TicketListing.Criteria;

public class GetTicketsDetailCriteria : CriteriaBase
{
    public DateTime? FromTransDate { get; set; }

    public DateTime? ToTransDate { get; set; }

    public int MatchId { get; set; }

    public string LicenseeName { get; set; }

    public string BetTypes { get; set; }

    public string SelectionType { get; set; }

    public string BallSequence { get; set; }

    public int LiveType { get; set; }

    public int? LiveHomeScore { get; set; }

    public int? LiveAwayScore { get; set; }

    public byte Type { get; set; }

    public int SecondAcceptFlag { get; set; }

    public string Quarter { get; set; }

    public string BetTeams { get; set; }

    public string SingleOrSubParlay { get; set; }

    public bool IsReSettled { get; set; }

    public string AffectTickets { get; set; }
    
    public string SelectionSubParlays { get; set; }

    public override string GetSettingKey() => "NAP_SpecialDelete_TicketListing_Detail";

    public override bool IsValid() => MatchId > 0;
}