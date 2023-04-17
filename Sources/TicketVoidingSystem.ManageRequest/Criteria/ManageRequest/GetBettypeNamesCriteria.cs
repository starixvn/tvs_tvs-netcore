using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class GetBettypeNamesCriteria : CriteriaBase
{
    public string RequestInfo { get; set; }

    public override string GetSettingKey() => "TicketVoiding_BettypesForRequest_Select";

    public override bool IsValid() => true;
}