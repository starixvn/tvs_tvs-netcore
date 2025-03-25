using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;

public class GetTicketsCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public int RequestId { get; set; }

    public int IssueTypeId { get; set; }

    public int? RequestDetailId { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_Void_Select");

    public override bool IsValid() => true;
}