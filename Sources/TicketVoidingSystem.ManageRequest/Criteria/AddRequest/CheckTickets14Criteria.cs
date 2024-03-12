using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class CheckTickets14Criteria : CriteriaBase
{
    public string TransIds { get; set; }

    public bool IsVoidAllArchivedTickets { get; set; }

    public string TransInfoJson { get; set; }

    public override string GetSettingKey() => "TicketVoiding_CheckTickets14";

    public override bool IsValid() => true;
}