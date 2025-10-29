using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Criteria.JackTimeHybridParlay;

public class HybridParlayTicketCriteria : OnlineServerCriteriaBase
{
    public string TransIds { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_TicketsDetail_Select");

    public override bool IsValid() => true;
}