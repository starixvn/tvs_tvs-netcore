namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class DuplicateTicketsViewModel
{
    public int MatchId { get; set; }

    public string TransIds { get; set; }

    public string OrgTransIds { get; set; }

    public int? FilterBy { get; set; }

    public int SubIssueTypeId { get; set; }
}