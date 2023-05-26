using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class GetActionsCriteria : CriteriaBase
{
    public override string GetSettingKey() => "TicketVoiding_Action_Select";

    public override bool IsValid() => true;
}