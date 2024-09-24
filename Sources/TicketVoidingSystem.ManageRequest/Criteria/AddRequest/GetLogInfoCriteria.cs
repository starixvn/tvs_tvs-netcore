using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetLogInfoCriteria : CriteriaBase
{
    public bool? IsShowLogOnly { get; set; }

    public int UserId { get; set; }

    public int? RequestId { get; set; }

    public int? ActionId { get; set; }

    public int? IssueTypeId { get; set; }

    public int? SubIssueTypeId { get; set; }

    public string? WrongScoreInfo { get; set; }

    public string? DangerAcceptedInfo { get; set; }

    public string? RedCardInfo { get; set; }

    public string? WrongHdpInfo { get; set; }

    public string? Wrong1stHdpInfo { get; set; }

    public string? WrongOuInfo { get; set; }

    public string? Wrong1stOuInfo { get; set; }

    public string? KickOffInfo { get; set; }

    public string? WrongOddsInfo { get; set; }

    public string? WrongOddsSBInfo { get; set; }

    public string ReducedOverInfo { get; set; }

    public string NotParticipateInfo { get; set; }

    public string WrongMarketOfferedInfo { get; set; }

    public string TechnicalErrorInfo { get; set; }

    public string? TransInfoJson { get; set; }

    public override string GetSettingKey() => "TicketVoiding_LogInfo_Select";

    public override bool IsValid() => true;
}