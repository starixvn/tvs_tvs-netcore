using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class EditRequestCommand : NonQueryCommand
{
    public int RequestId { get; set; }
    public int? SubIssueTypeId { get; set; }
    public int? ActionId { get; set; }
    public bool IsVoided { get; set; }
    public string MistakenBy { get; set; }
    public int? CheckedBy { get; set; }
    public string DecidedBy { get; set; }
    public string? Operators { get; set; }
    public string? Provider { get; set; }
    public string? Source { get; set; }
    public string? Remark { get; set; }
    public string? BriefInfoNote { get; set; }
    public int UserId { get; set; }
    public string IP { get; set; }
    public bool? IsTest { get; set; }
    public int IssueTypeId { get; set; }
    public int MatchId { get; set; }
    public string? TransIds { get; set; }
    public int? FilterBy { get; set; }
    public string? TransInfoJson { get; set; }

    public string? WrongScoreInfo { get; set; }
    public string? DangerAcceptedInfo { get; set; }
    public string? RedCardInfo { get; set; }
    public string? WrongHdpInfo { get; set; }
    public string? Wrong1stHdpInfo { get; set; }
    public string? WrongOuInfo { get; set; }
    public string? Wrong1stOuInfo { get; set; }
    public string? WrongOddsInfo { get; set; }
    public string? WrongOddsSBInfo { get; set; }
    public string? ReducedOverInfo { get; set; }
    public string? NotParticipateInfo { get; set; }
    public string? AbnormalAccountInfo { get; set; }
    public string? KickOffInfo { get; set; }
    public string? DuplicateTicketsInfo { get; set; }
    public string? RecoverTicketInfo { get; set; }
    public string? AbnormalBetInfo { get; set; }
    public string WrongMarketOfferedInfo { get; set; }
    public string TechnicalErrorInfo { get; set; }
    public string WrongOfferedNameInfo { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Request_Update";

    public override bool IsValid() => true;
}