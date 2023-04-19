using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.SharedApi;

public class GetIssueTypeCriteria : CriteriaBase
{
    public override string GetSettingKey() => "TicketVoiding_MessageTemplate_IssueType_Select";

    public override bool IsValid() => true;
}