using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetSubIssueTypeLinkMatchCriteria : CriteriaBase
{
    public int MainSubIssueTypeId { get; set; }
    public string LinkMatchIds { get; set; }

    public override string GetSettingKey() => "TicketVoiding_SubIssueType_AutoSelect";

    public override bool IsValid() => true;
}