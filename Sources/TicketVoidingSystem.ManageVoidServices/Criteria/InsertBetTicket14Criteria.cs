using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageVoidServices.Criteria;

public class InsertBetTicket14Criteria : OnlineServerCriteriaBase
{
    public string TransIds { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_BetTicket14_Insert");

    public override bool IsValid() => !string.IsNullOrWhiteSpace(TransIds);
}