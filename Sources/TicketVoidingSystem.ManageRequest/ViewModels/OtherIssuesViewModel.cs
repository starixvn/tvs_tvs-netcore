using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.SharedApi.Models.BetTypes;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class OtherIssuesViewModel
{
    public int MatchId { get; set; }
    public int IssueTypeId { get; set; }
    public int SubIssueTypeId { get; set; }
    public DateTime? FilterFromTransTime { get; set; }
    public DateTime? FilterToTransTime { get; set; }
    public DateTime? VoidFromTime { get; set; }
    public DateTime? VoidToTime { get; set; }
    public LogInfoDetail? LogInfoDetail { get; set; }
    public IEnumerable<BetTeamAddRequestResult> BetTeamsResult { get; set; }
    public IEnumerable<GroupBetTypeModel> GroupBetTypes { get; set; }
}