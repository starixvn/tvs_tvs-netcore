using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest.VoidedTickets;

public class GetRecoveredTicketsCriteria : OnlineServerCriteriaBase
{
    public int RequestId { get; set; }

    public string OnlineServerId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_RecoveredTicket_Select");

    public override bool IsValid() => true;
}