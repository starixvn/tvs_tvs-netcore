namespace TicketVoidingSystem.ManageRequest.Models;

public class GetTransInfoQuery
{
    public int MatchId { get; set; }
    public int IssueTypeId { get; set; }
    public string TransIds { get; set; }

    public AbnormalAccountViewModel? AbnormalAccountViewModel { get; set; }
    public RecoverTicketViewModel? RecoverTicketModel { get; set; }
    public IEnumerable<WrongScoreInfoViewModel>? WrongScoreModels { get; set; }
    public IEnumerable<DangerAcceptedViewModel>? DangerAcceptedModels { get; set; }
    public IEnumerable<DangerAcceptedViewModel>? RedCardModels { get; set; }
    public IEnumerable<WrongHdpViewModel>? WrongHdpModels { get; set; }
    public IEnumerable<WrongHdpViewModel>? Wrong1stHdpModels { get; set; }
    public IEnumerable<WrongOuViewModel>? WrongOuModels { get; set; }
    public IEnumerable<WrongOuViewModel>? Wrong1stOuModels { get; set; }
    public IEnumerable<WrongOddsViewModel>? WrongOddsModels { get; set; }
    public WrongOddsSportsBookViewModel? WrongOddsSportsBookModels { get; set; }
    public IEnumerable<ReducedOverViewModel>? ReducedOverModels { get; set; }
    public IEnumerable<NotParticipateViewModel>? NotParticipateModels { get; set; }
    public IEnumerable<EarlyKickOffViewModel>? EarlyKickOffModels { get; set; }
    public AbnormalBetViewModel? AbnormalBetModel { get; set; }
    public IEnumerable<WrongMarketOfferedViewModel>? WrongMarketOfferedModels { get; set; }
    public TechnicalErrorViewModel? TechnicalErrorModel { get; set; }
    public WrongOfferedNameViewModel? WrongOfferedNameModel { get; set; }
    public OtherIssuesViewModel? OtherIssuesModel { get; set; }
    public OtherIssuesViewModel? MatchEarlyCompletedModel { get; set; }
}