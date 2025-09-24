namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class NotParticipateViewModel
{
    public DateTime? EventDate { get; set; }
    public int MatchId { get; set; }
    public int IssueTypeId { get; set; }
    public int SubIssueTypeId { get; set; }
    public int PlayerId { get; set; }
    public string BetTypeIds { get; set; }
    public LogInfoDetail? LogInfoDetail { get; set; }
}