namespace TicketVoidingSystem.ManageRequest.Models;

public class GetVoidedTicketsQuery
{
    public int RequestId { get; set; }

    public int? MatchId { get; set; }

    public string VoidingHistoryIds { get; set; }

    public int IssueTypeId { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }

    public bool IsCreditOnly { get; set; }

    public string SingleTransIds { get; set; }
}