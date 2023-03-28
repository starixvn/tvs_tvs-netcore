using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageVoidServices.Criteria;

public class GetTicketVoidingQueueCriteria : CriteriaBase
{
    public int VoidingHistoryId { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_ManageVoidServices_Queue_Select");

    public override bool IsValid() => true;
}