using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;

public class AllMarkedTicketsCriteria : OnlineServerCriteriaBase
{
    public int MarkedBy { get; set; }

    public string OnlineServerId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "Nap_SpecialDelete_AllMarkedTicketsSummary_Select");

    public override bool IsValid() => true;
}