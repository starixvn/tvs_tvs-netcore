using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Models;

public class EditRequestQuery
{
    public EditRequestQuery()
    {
        OperatorsList = new List<OperatorQuery>();
    }

    public int? SportType { get; set; }
    public int IssueTypeId { get; set; }
    public int SubIssueTypeId { get; set; }
    public int ActionId { get; set; }
    public string? MistakenBy { get; set; }
    public string? DecidedBy { get; set; }
    public List<OperatorQuery>? OperatorsList { get; set; }
    public string? Provider { get; set; }
    public string? Source { get; set; }
    public string? Remark { get; set; }
    public int Creator { get; set; }
    public int? MatchId { get; set; }
    public DateTime? KickOffTime { get; set; }
    public int RequestId { get; set; }
    public bool IsTest { get; set; }
    public string? TransIds { get; set; }
    public bool IsVoided { get; set; }
    public bool? IsConfirmCalculator { get; set; }
    public string? UnMarkTransIds { get; set; }
    public string? MarkTransIds { get; set; }
    public string? RemoveTransIds { get; set; }
    public AbnormalAccountViewModel? AbnormalAccountInfo { get; set; }
    public IEnumerable<WrongScoreInfoViewModel>? WrongScoreInfo { get; set; }
    public IEnumerable<DangerAcceptedViewModel>? DangerAcceptedInfo { get; set; }
    public IEnumerable<DangerAcceptedViewModel>? RedCardInfo { get; set; }
    public IEnumerable<WrongHdpViewModel>? WrongHdpInfo { get; set; }
    public IEnumerable<WrongHdpViewModel>? Wrong1stHdpInfo { get; set; }
    public IEnumerable<WrongOuViewModel>? WrongOuInfo { get; set; }
    public IEnumerable<WrongOuViewModel>? Wrong1stOuInfo { get; set; }
    public IEnumerable<WrongOddsViewModel>? WrongOddsInfo { get; set; }
    public IEnumerable<ReducedOverViewModel>? ReducedOverInfo { get; set; }
    public string? TransInfoJson { get; set; }
}