namespace TicketVoidingSystem.ManageRequest.Models;

public class SelectRequestsQuery
{
    public string? RequestId { get; set; }
    public string? RequestIdXml { get; set; }
    public int? MatchId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string IssueTypeId { get; set; }
    public string SubIssueType { get; set; }
    public int Status { get; set; }
    public bool IsExcludeTest { get; set; }
    public bool? IsFromDateBeforeBUDay { get; set; }
    public bool? IsToDateBeforeBUDay { get; set; }
    public DateTime? BUDay { get; set; }
    public int CreatedBy { get; set; }
}