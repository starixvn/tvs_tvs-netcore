using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class InsertAutoVoidRequestQueueCommand : NonQueryCommand
{
    public int IssueTypeId { get; set; }

    public string RequestIds { get; set; }

    public int MatchId { get; set; }

    public int ActionId { get; set; }

    public string BroadcastSessionId { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_Request_AutoVoidQueue_Insert");

    public override bool IsValid() => true;
}