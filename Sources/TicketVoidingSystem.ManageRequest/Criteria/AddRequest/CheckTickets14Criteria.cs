using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class CheckTickets14Criteria : OnlineServerCriteriaBase
{
    public string TransIds { get; set; }

    public bool IsVoidAllArchivedTickets { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_CheckTickets14");

    public override bool IsValid() => true;
}