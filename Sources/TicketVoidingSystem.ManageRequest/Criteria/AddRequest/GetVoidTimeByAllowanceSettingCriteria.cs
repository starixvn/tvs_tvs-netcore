using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetVoidTimeByAllowanceSettingCriteria : CriteriaBase
{
    public int? ActionId { get; set; }

    public int IssueTypeId { get; set; }

    public string? DangerAcceptedInfo { get; set; }

    public string? RedCardInfo { get; set; }

    public string? WrongScoreInfo { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_VoidTimeByAllowanceSetting_Select");

    public override bool IsValid() => true;
}