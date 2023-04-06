using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;

public class GetReasonNameCriteria : CriteriaBase
{
    public int SubIssueTypeId { get; set; }
    public int SportType { get; set; }

    public override string GetSettingKey() => "TicketVoiding_ReasonTemplate_Select";

    public override bool IsValid() => true;
}