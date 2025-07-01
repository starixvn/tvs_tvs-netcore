using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class PendingMarkTicketsCommand : NonQueryCommand
{
    public int RequestId { get; set; }

    public string SiteDBDownInfoJson { get; set; }

    public override string GetSettingKey() => "TicketVoiding_PendingMarkTickets_Insert";

    public override bool IsValid() => true;
}