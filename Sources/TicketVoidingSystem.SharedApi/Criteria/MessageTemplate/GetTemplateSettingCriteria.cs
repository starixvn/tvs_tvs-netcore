using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.MessageTemplate;

public class GetTemplateSettingCriteria : CriteriaBase
{
    public override string GetSettingKey() => "TicketVoiding_MessageTemplate_Settings_Select";

    public override bool IsValid() => true;
}