using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest.VoidedTickets;

public class GetVoidedTickets14Criteria : OnlineServerCriteriaBase
{
    public string VoidingHistoryIds { get; set; }

    public string OnlineServerId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_VoidedTicket14_Select");

    public override bool IsValid() => true;
}