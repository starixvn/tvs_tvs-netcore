using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class GetTotalVoidedTicketCriteria : CriteriaBase
{
    public string RequestInfo { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_TotalVoidedTicket_Select");

    public override bool IsValid() => true;
}