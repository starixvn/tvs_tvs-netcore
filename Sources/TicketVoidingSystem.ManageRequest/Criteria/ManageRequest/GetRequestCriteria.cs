using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class GetRequestCriteria : CriteriaBase
{
    public int RequestId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Request_Select";

    public override bool IsValid() => true;
}