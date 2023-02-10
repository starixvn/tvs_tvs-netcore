using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageVoidServices.Criteria;

public class UpdateTicketVoidingQueueByBatchCriteria : NonQueryCommand
{
    public string QueueIds { get; set; }
    public int StatusId { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_ManageVoidServices_Queue_Update");

    public override bool IsValid() => true;
}