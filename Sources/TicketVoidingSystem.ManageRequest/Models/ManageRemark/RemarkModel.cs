namespace TicketVoidingSystem.ManageRequest.Models.ManageRemark;

public class RemarkModel
{
    public int RemarkId { get; set; }
    public int MatchId { get; set; }
    public string Description { get; set; }
    public string CreatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public string MistakenBy { get; set; }
    public string DecidedBy { get; set; }
    public string PerformedBy { get; set; }
    public string Iptv { get; set; }
    public string Suspender { get; set; }
    public string CloseCaseBy { get; set; }
    public string ActionName { get; set; }
    public string? SettlementStatus { get; set; }
}

