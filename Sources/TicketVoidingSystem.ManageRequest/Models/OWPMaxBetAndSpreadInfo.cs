namespace TicketVoidingSystem.ManageRequest.Models;

public class OWPMaxBetAndSpreadInfo
{
    public int AdminSiteID { get; set; }
    public MaxbetSpreadByBetType Spread { get; set; }
    public MaxbetSpreadByBetType Maxbet { get; set; }
}

public class MaxbetSpreadByBetType
{
    public decimal? Handicap { get; set; }
    public decimal? OverUnder { get; set; }
    public decimal? FirstHalfHandicap { get; set; }
    public decimal? FirstHalfOverUnder { get; set; }
}