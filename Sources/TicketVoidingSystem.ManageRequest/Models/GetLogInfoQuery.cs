using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Models;

public class GetLogInfoQuery
{
    public int MatchId { get; set; }
    public int? RequestId { get; set; }
    public int? ActionId { get; set; }
    public int IssueTypeId { get; set; }
    public int? SubIssueTypeId { get; set; }
    public IEnumerable<WrongScoreInfoViewModel>? WrongScoreModels { get; set; }
    public IEnumerable<DangerAcceptedViewModel>? DangerAcceptedModels { get; set; }
    public IEnumerable<DangerAcceptedViewModel>? RedCardModels { get; set; }
    public IEnumerable<WrongHdpViewModel>? WrongHdpModels { get; set; }
    public IEnumerable<WrongHdpViewModel>? Wrong1stHdpModels { get; set; }
    public IEnumerable<WrongOuViewModel>? WrongOuModels { get; set; }
    public IEnumerable<WrongOuViewModel>? Wrong1stOuModels { get; set; }
    public IEnumerable<WrongOddsViewModel>? WrongOddsModels { get; set; }
    public IEnumerable<ReducedOverViewModel>? ReducedOverModels { get; set; }
    public IEnumerable<NotParticipateViewModel>? NotParticipateModels { get; set; }
    public IEnumerable<EarlyKickOffViewModel>? EarlyKickOffModels { get; set; }
    public WrongMarketOfferedViewModel? WrongMarketOfferedModel { get; set; }
    public WrongOddsSportsBookViewModel? WrongOddsSportsBookModel { get; set; }
    public WrongOfferedNameViewModel? WrongOfferedNameModel { get; set; }
    public OtherIssuesViewModel? OtherIssuesModel { get; set; }
    public bool? IsShowLogOnly { get; set; }
    public DateTime? KickOffTime { get; set; }
}