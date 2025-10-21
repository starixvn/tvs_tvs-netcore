using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;

public class MarkTicketsCommand : OnlineServerCriteriaBase
{
    public int UserId { get; set; }

    public string Ip { get; set; }

    public int LogActionId { get; set; }

    public byte Status { get; set; }

    public string TransIds { get; set; }

    public int? IssueTypeId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "Nap_SpecialDelete_MarkTickets_Update");

    public override bool IsValid() => true;
}