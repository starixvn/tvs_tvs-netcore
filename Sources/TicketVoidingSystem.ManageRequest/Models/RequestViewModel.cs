namespace TicketVoidingSystem.ManageRequest.Models;

public class RequestViewModel
{
    public int RequestId { get; set; }
    public int IssueTypeId { get; set; }
    public int SubIssueTypeId { get; set; }
    public int ActionId { get; set; }
    public string CreatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public string MistakenBy { get; set; }
    public string DecidedBy { get; set; }
    public string LastPerformedBy { get; set; }
    public string CheckedBy { get; set; }
    public bool IsCheckedBy => !string.IsNullOrWhiteSpace(CheckedBy);
    public bool IsCheckedVar { get; set; }
    public DateTime EventDate { get; set; }
    public string Status { get; set; }
    public List<RequestEventViewModel> Details { get; set; }
    public IEnumerable<string> BettypeNames { get; set; }
    public DateTime? CalcHalfTime { get; set; }
    public DateTime? CalcFullTime { get; set; }
    public int? FilterBy { get; set; }
    public bool IsStored { get; set; }
}

public class RequestEventViewModel
{
    public int? MatchId { get; set; }
    public int? RequestDetailId { get; set; }
    public string SettlementStatus { get; set; }
    public int SubIssueTypeId { get; set; }
    public string Description { get; set; }
    public int TotalSingleProcessed { get; set; }
    public int TotalParlayProcessed { get; set; }
    public int TotalCancelCashOutProcessed { get; set; }
    public int TotalResettleProcessed { get; set; }

    public DateTime KickOffTimeMatch { get; set; }
    public DateTime EventDateMatch { get; set; }
    public string Provider { get; set; }
    public string Source { get; set; }
    public string Remark { get; set; }
    public string Trader { get; set; }
    public string LA { get; set; }
    public string TVAndIPTV { get; set; }
    public string Message { get; set; }
}