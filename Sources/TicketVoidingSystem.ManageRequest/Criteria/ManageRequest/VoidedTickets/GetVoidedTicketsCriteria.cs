using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest.VoidedTickets;

public class GetVoidedTicketsCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public string VoidingHistoryIds { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_VoidedTicket_Select");

    public override bool IsValid() => true;
}