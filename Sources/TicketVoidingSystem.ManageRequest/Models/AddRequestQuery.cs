namespace TicketVoidingSystem.ManageRequest.Models;

public class AddRequestQuery
{
    public int SessionTime { get; set; }

    public string Guid { get; set; }

    public int SubIssueTypeId { get; set; }

    public int ActionId { get; set; }

    public string? MistakenBy { get; set; }

    public string? DecidedBy { get; set; }

    public List<OperatorQuery>? OperatorsList { get; set; } = [];

    public string? Provider { get; set; }

    public string? Source { get; set; }

    public string? Remark { get; set; }

    public int Creator { get; set; }

    public bool IsTest { get; set; }

    public int IssueTypeId { get; set; }

    public int? MatchId { get; set; }

    public string? TransIds { get; set; }

    public int? FilterBy { get; set; }

    public string? MarkTransIds { get; set; }

    public string? UnMarkTransIds { get; set; }

    public string TransInfoJson { get; set; }

    public string? SiteDBDownInfoJson { get; set; }

    public IEnumerable<WrongScoreInfoViewModel>? WrongScoreInfo { get; set; }

    public AbnormalAccountViewModel? AbnormalAccountInfo { get; set; }

    public IEnumerable<DangerAcceptedViewModel>? DangerAcceptedInfo { get; set; }

    public IEnumerable<WrongHdpViewModel>? WrongHdpInfo { get; set; }

    public IEnumerable<DangerAcceptedViewModel>? RedCardInfo { get; set; }

    public IEnumerable<WrongHdpViewModel>? Wrong1stHdpInfo { get; set; }

    public IEnumerable<WrongOuViewModel>? Wrong1stOuInfo { get; set; }

    public IEnumerable<WrongOuViewModel>? WrongOuInfo { get; set; }

    public IEnumerable<WrongOddsViewModel>? WrongOddsInfo { get; set; }

    public IEnumerable<ReducedOverViewModel>? ReducedOverInfo { get; set; }

    public IEnumerable<EarlyKickOffViewModel>? EarlyKickOffInfo { get; set; }

    public IEnumerable<NotParticipateViewModel>? NotParticipateInfo { get; set; }

    public DuplicateTicketsViewModel? DuplicateTicketsInfo { get; set; }

    public RecoverTicketViewModel? RecoverTicketInfo { get; set; }

    public AbnormalBetViewModel? AbnormalBetInfo { get; set; }

    public IEnumerable<WrongMarketOfferedViewModel>? WrongMarketOfferedInfo { get; set; }

    public WrongOddsSportsBookViewModel? WrongOddsSportsBookInfo { get; set; }

    public WrongOfferedNameViewModel? WrongOfferedNameInfo { get; set; }

    public TechnicalErrorViewModel? TechnicalErrorInfo { get; set; }

    public OtherIssuesViewModel? OtherIssuesInfo { get; set; }

    public OtherIssuesViewModel? MatchEarlyCompletedInfo { get; set; }
}