using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class InsertAutoVoidRequestQueueCommand : NonQueryCommand
{
    public string RequestIds { get; set; }

    public string Action { get; set; }

    public int StatusId { get; set; }

    public string BroadcastSessionId { get; set; }

    public int? MatchId { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_AutoVoidRequest_Queue_Insert");

    public override bool IsValid() => true;
}