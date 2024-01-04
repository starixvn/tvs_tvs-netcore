namespace TicketVoidingSystem.ManageRequest.Models;

public class GetRequestInfoModel
{
    public int RequestId { get; set; }

    public bool IsActiveRequest { get; set; }

    public int MatchId { get; set; }

    public int TotalSingleProcessed { get; set; }

    public int TotalParlayProcessed { get; set; }

    public int TotalCancelCashOutProcessed { get; set; }

    public int IssueTypeId { get; set; }

    public int VoidingHistoryId { get; set; }
}