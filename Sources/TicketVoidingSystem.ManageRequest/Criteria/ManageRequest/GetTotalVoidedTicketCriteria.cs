using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class GetTotalVoidedTicketCriteria : OnlineServerCriteriaBase
{
    public string RequestInfo { get; set; }

    public string OnlineServerId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_TotalVoidedTicket_Select");

    public override bool IsValid() => true;
}