namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class RecoverTicketViewModel
{
    public string TransIds { get; set; }

    public int? FilterBy { get; set; }

    public string ProductIds { get; set; }

    public int SubIssueTypeId { get; set; }
}