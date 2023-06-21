using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class ReducedOverViewModel
{
    public DateTime? EventDate { get; set; }
    public int MatchId { get; set; }
    public int IssueTypeId { get; set; }
    public int SubIssueTypeId { get; set; }
    public string BetTypeIds { get; set; }
    public string WicketOver { get; set; }
    public string PlayerIds { get; set; }
    public string Runs { get; set; }
    public bool NonLive { get; set; }
    public bool Live { get; set; }
    public LogInfoDetail? LogInfoDetail { get; set; }
}