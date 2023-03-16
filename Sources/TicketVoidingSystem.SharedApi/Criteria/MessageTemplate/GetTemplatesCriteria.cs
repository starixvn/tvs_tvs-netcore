using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.MessageTemplate;

public class GetTemplatesCriteria : CriteriaBase
{
    public override string GetSettingKey() => "TicketVoiding_MessageTemplate_Select";

    public override bool IsValid() => true;
}