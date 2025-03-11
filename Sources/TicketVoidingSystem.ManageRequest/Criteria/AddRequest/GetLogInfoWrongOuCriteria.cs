using Fanex.Data;
using Fanex.Data.Repository;

public class GetLogInfoWrongOuCriteria : CriteriaBase
{
    public bool? IsShowLogOnly { get; set; }

    public int UserId { get; set; }

    public int? RequestId { get; set; }

    public int? ActionId { get; set; }

    public int? IssueTypeId { get; set; }

    public int? SubIssueTypeId { get; set; }

    public string? WrongOuInfo { get; set; }

    public string? Wrong1stOuInfo { get; set; }

    public string? TransInfoJson { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_LogInfo_Select";

    public override bool IsValid() => true;
}