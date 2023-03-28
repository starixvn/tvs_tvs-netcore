using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;

public class MarkAllTicketsCommand : CriteriaBase
{
    public string Matches { get; set; }

    public int UserId { get; set; }

    public string Ip { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "Nap_SpecialDelete_AllMarkedTicketsSummary_Update");

    public override bool IsValid() => true;
}