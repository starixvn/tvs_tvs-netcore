using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetOperatorsInfoCriteria : CriteriaBase
{
    public string MatchIds { get; set; }

    public override string GetSettingKey() => "TicketVoiding_OperatorInfo_Select";

    public override bool IsValid() => true;
}