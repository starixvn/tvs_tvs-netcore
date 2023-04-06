using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;

public class GetRequestLastModifiedDateCriteria : CriteriaBase
{
    public int RequestId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_LastModifiedDate_Select";

    public override bool IsValid() => RequestId > 0;
}