namespace TicketVoidingSystem.ManageRequest.Models;

public class CheckValidTransIdsModel
{
    public string TransIds { get; set; }

    public int IssueTypeId { get; set; }

    public int SubIssueTypeId { get; set; }

    public int? RequestId { get; set; }

    public int ActionId { get; set; }

    public int? FilterBy { get; set; }

    public bool IsRemoveCustomerClass201 { get; set; }

    public bool IsRemoveCustomerClass4K { get; set; }

    public bool IsAddSettledTickets { get; set; }
}