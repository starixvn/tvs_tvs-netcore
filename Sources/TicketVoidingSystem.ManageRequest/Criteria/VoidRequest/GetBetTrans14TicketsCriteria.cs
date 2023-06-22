using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;

public class GetBetTrans14TicketsCriteria : CriteriaBase
{
    public int RequestId { get; set; }

    public string TransInfoJson { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Void14_Select";

    public override bool IsValid() => true;
}