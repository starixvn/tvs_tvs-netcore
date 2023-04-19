using Fanex.Data.Repository;

namespace TicketVoidingSystem.Criteria.SendEmail;

public class GetOperatorInfoCriteria : CriteriaBase
{
    public string AgentIdsXml { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Email_OperatorInfo_Select";

    public override bool IsValid() => true;
}