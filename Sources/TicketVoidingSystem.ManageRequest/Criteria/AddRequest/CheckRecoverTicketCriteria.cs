using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class CheckRecoverTicketCriteria : CriteriaBase
{
    public string TransIds { get; set; }

    public int? RequestId { get; set; }

    public int? FilterBy { get; set; }

    public string ProductIds { get; set; }

    public string TransInfoJson { get; set; }

    public string IsVoidAllArchivedTickets { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Request_CheckRecoverTicket";

    public override bool IsValid() => true;
}