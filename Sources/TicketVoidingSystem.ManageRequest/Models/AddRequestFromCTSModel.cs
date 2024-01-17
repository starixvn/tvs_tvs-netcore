namespace TicketVoidingSystem.ManageRequest.Models;

public class AddRequestFromCTSModel
{
    public string UserId { get; set; }
    public string OnUserId { get; set; }
    public string Time { get; set; }
    public bool IsTest { get; set; }
    public IEnumerable<long> TransIds { get; set; }
    public string IssueTypeId { get; set; }
    public string SubIssueTypeId { get; set; }
    public string ActionId { get; set; }
}