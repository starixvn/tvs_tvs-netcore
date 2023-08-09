using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetTransInfoDuplicateTicketsCriteria : CriteriaBase
{
    public string TransIds { get; set; }

    public override string GetSettingKey() => "TicketVoiding_DuplicateTickets_Select";

    public override bool IsValid() => true;
}