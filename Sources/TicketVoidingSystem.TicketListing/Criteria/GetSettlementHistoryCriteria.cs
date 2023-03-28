using Fanex.Data.Repository;

namespace TicketVoidingSystem.TicketListing.Criteria;

public class GetSettlementHistoryCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public override string GetSettingKey() => "NAP_SpecialDelete_TicketListing_SettlementHistory";

    public override bool IsValid() => true;
}