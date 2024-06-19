namespace TicketVoidingSystem.ManageRequest.Models;

public class OWPMaxBetAndSpreadInfo
{
    public int AdminSiteID { get; set; }
    public IEnumerable<SubIssueTypeWrongOdds> Spreads { get; set; }
    public IEnumerable<SubIssueTypeWrongOdds> MaxBets { get; set; }
}

public class SubIssueTypeWrongOdds
{
    public decimal Handicap { get; set; }
    public decimal OverUnder { get; set; }
    public decimal FirstHalfHandicap { get; set; }
    public decimal FirstHalfOverUnder { get; set; }
}