using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;

public class GetBetTrans14TicketsCriteria : OnlineServerCriteriaBase
{
    public int RequestId { get; set; }
    public string OnlineServerId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_Void14_Select");

    public override bool IsValid() => true;
}