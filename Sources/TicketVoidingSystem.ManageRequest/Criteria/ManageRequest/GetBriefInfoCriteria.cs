using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class GetBriefInfoCriteria : OnlineServerCriteriaBase
{
    public string VoidingHistoryIds { get; set; }

    public string OnlineServerId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_BriefInfo_Select");

    public override bool IsValid() => true;
}