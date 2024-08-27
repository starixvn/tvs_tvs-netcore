using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetDecidedByCriteria : CriteriaBase
{
    public override string GetSettingKey() => "TicketVoiding_DecidedBy_Select";

    public override bool IsValid() => true;
}