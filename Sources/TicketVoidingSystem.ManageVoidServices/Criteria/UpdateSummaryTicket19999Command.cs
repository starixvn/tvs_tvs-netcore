using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageVoidServices.Criteria;

public class UpdateSummaryTicket19999Command : OnlineServerNonQueryCommand
{
    public string TransIds { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_SummaryTicket19999_Update");

    public override bool IsValid() => !string.IsNullOrWhiteSpace(TransIds);
}