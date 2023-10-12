using Fanex.Data.Repository;

namespace TicketVoidingSystem.Criteria;

public class GetMatchInfoVoidByCurrencyCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public override string GetSettingKey() => "NAP_SpecialDelete_VoidByCurrency_MatchInfo_Select";

    public override bool IsValid() => MatchId > 0;
}