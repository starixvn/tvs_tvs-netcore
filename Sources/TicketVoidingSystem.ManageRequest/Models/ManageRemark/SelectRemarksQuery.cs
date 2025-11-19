namespace TicketVoidingSystem.ManageRequest.Models.ManageRemark;

public class SelectRemarksQuery
{
    public int? RemarkId { get; set; }
    public int? MatchId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string? ActionIds { get; set; }
    public string? CreatedBy { get; set; }
    public bool? IsExcludeTest { get; set; }
    public bool? IsFromDateBeforeBUDay { get; set; }
    public bool? IsToDateBeforeBUDay { get; set; }
    public DateTime? BUDay { get; set; }
}