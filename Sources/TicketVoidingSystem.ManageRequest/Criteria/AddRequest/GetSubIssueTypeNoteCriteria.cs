using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetSubIssueTypeNoteCriteria : CriteriaBase
{
    public int IssueTypeId { get; set; }

    public int UserId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_SubIssueTypeNote_Select";

    public override bool IsValid() => true;
}