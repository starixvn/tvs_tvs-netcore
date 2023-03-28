using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageVoidServices.Criteria;

public class GetAutoVoidRequestQueueCriteria : CriteriaBase
{
    public string BroadcastSessionId { get; set; }
    public int? StatusId { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_ManageVoidServices_AutoVoidQueue_Select");

    public override bool IsValid() => true;
}