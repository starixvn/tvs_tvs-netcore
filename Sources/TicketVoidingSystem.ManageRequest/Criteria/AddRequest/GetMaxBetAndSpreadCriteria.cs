using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetMaxBetAndSpreadCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public int SubType { get; set; }

    public override string GetSettingKey() => "Spread_MaxBet";

    public override bool IsValid() => true;
}