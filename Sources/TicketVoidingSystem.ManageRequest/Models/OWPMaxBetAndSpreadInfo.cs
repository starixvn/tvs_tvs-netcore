namespace TicketVoidingSystem.ManageRequest.Models;

public class OWPMaxBetAndSpreadInfo
{
    public int AdminSiteID { get; set; }
    public SubIssueTypeWrongOdds Spread { get; set; }
    public SubIssueTypeWrongOdds Maxbet { get; set; }
}

public class SubIssueTypeWrongOdds
{
    public decimal Handicap { get; set; }
    public decimal OverUnder { get; set; }
    public decimal FirstHalfHandicap { get; set; }
    public decimal FirstHalfOverUnder { get; set; }
}