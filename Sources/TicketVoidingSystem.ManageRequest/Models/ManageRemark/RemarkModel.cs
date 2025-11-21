namespace TicketVoidingSystem.ManageRequest.Models.ManageRemark;

public class RemarkModel
{
    public int RemarkId { get; set; }
    public int MatchId { get; set; }
    public string Description { get; set; }
    public bool IsCheckedVar { get; set; }
    public string CreatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public string MistakenBy { get; set; }
    public string DecidedBy { get; set; }
    public string PerformedBy { get; set; }
    public string Iptv { get; set; }
    public string Suspender { get; set; }
    public string CloseCaseBy { get; set; }
    public string ActionId { get; set; }
    public string? SettlementStatus { get; set; }
    public string MatchCode { get; set; }
    public int HomeId { get; set; }
    public int AwayId { get; set; }
    public int LeagueId { get; set; }
    public int SportType { get; set; }
    public string ActionName { get; set; }


    // More Info for Excel
    public string Trader { get; set; }
    public string Source { get; set; }
    public string Remark { get; set; }
    public string Message { get; set; }
    public DateTime EventDate { get; set; }
    public DateTime KickOffTime { get; set; }
    public string LeagueName { get; set; }
    public string EventName { get; set; }
    public string SportTypeName { get; set; }
    public string Provider { get; set; }
    public string DescriptionInput { get; set; }
}