using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest.VoidedTickets;

public class GetVoidedTickets14Criteria : CriteriaBase
{
    public string VoidingHistoryIds { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_VoidedTicket14_Select");

    public override bool IsValid() => true;
}