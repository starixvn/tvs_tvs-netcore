namespace TicketVoidingSystem.ManageRequest.Models.ManageRemark;

public class AddRemarkQuery
{
    public int? RemarkId { get; set; }
    public string Guid { get; set; } = string.Empty;
    public int MatchId { get; set; }
    public bool IsTest { get; set; }
    public bool IsCheckedVar { get; set; }
    public string MistakenBy { get; set; }
    public string DecidedBy { get; set; }
    public string PerformedBy { get; set; }
    public string Iptv { get; set; }
    public List<OperatorQuery>? OperatorsList { get; set; } = [];
    public string Provider { get; set; }
    public string Source { get; set; }
    public string Remark { get; set; }
    public string Message { get; set; }
    public string Description { get; set; }
    public string ActionId { get; set; }
}