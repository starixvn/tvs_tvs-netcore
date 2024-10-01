using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.SharedApi.Models.BetTypes;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class WrongOddsSportsBookViewModel
{
    public int MatchId { get; set; }
    public int IssueTypeId { get; set; }
    public int SubIssueTypeId { get; set; }
    public DateTime FilterFromTransTime { get; set; }
    public DateTime FilterToTransTime { get; set; }
    public DateTime? VoidFromTime { get; set; }
    public DateTime? VoidToTime { get; set; }
    public int LiveIndicator { get; set; }
    public string FilterOddsType { get; set; }
    public string OddsValue { get; set; }
    public string FromOdds { get; set; }
    public string ToOdds { get; set; }
    public string CorrectOdds { get; set; }
    public IEnumerable<BetTeamAddRequestResult> BetTeamsResult { get; set; }
    public IEnumerable<GroupBetTypeModel> GroupBetTypes { get; set; }
    public LogInfoDetail? LogInfoDetail { get; set; }
}