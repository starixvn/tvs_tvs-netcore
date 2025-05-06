using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Models;

public class GetTicketsQuery
{
    public Match? Match { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }

    public int? RequestId { get; set; }

    public int? RequestDetailId { get; set; }

    public int IssueTypeId { get; set; }

    public int SubIssueTypeId { get; set; }
}