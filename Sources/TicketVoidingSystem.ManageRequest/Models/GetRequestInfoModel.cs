namespace TicketVoidingSystem.ManageRequest.Models;

public class GetRequestInfoModel
{
    public int RequestId { get; set; }

    public bool IsActiveRequest { get; set; }

    public int MatchId { get; set; }

    public int TotalVoidedSingle { get; set; }

    public int TotalVoidedParlay { get; set; }

    public int TotalCancelCashOut { get; set; }

    public int IssueTypeId { get; set; }

    public int VoidingHistoryId { get; set; }
}