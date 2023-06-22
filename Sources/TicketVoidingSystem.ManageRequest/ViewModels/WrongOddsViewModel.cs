using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class WrongOddsViewModel
{
    public int MatchId { get; set; }
    public int IssueTypeId { get; set; }
    public int SubIssueTypeId { get; set; }
    public DateTime? EventDate { get; set; }
    public DateTime FilterFromTransTime { get; set; }
    public DateTime FilterToTransTime { get; set; }
    public DateTime? VoidFromTime { get; set; }
    public DateTime? VoidToTime { get; set; }
    public string FilterOddsType { get; set; }
    public string FilterFavoriteType { get; set; }
    public string FilterOuType { get; set; }
    public string OddsValue { get; set; }
    public string FromOdds { get; set; }
    public string ToOdds { get; set; }
    public string CorrectOdds { get; set; }
    public string BetTeam { get; set; }
    public string OuValue { get; set; }
    public string FavoriteValue { get; set; }
    public int LiveIndicator { get; set; }
    public string PoolHouseCheckedBetTypes { get; set; }
    public bool IsLinkGroup1X2 { get; set; }
    public bool IsLinkGroupAIO { get; set; }
    public LogInfoDetail? LogInfoDetail { get; set; }
}