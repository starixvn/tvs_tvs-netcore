using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class NotParticipateViewModel
{
    public DateTime? EventDate { get; set; }
    public int MatchId { get; set; }
    public int IssueTypeId { get; set; }
    public int SubIssueTypeId { get; set; }
    public int BetTypeId { get; set; }
    public string? PlayerIds { get; set; }
    public LogInfoDetail? LogInfoDetail { get; set; }
}