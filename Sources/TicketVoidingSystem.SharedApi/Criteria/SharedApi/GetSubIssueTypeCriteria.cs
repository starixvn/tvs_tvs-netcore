using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.SharedApi;

public class GetSubIssueTypeCriteria : CriteriaBase
{
    public override string GetSettingKey() => "TicketVoiding_MessageTemplate_SubIssueType_Select";

    public override bool IsValid() => true;
}