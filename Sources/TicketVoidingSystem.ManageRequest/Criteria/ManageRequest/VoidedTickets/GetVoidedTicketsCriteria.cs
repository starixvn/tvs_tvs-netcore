using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest.VoidedTickets;

public class GetVoidedTicketsCriteria : OnlineServerCriteriaBase
{
    public int MatchId { get; set; }

    public string VoidingHistoryIds { get; set; }

    public string OnlineServerId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_VoidedTicket_Select");

    public override bool IsValid() => true;
}