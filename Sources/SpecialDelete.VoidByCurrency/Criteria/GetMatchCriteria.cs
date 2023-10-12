using Fanex.Data.Repository;

namespace SpecialDelete.VoidByCurrency.Criteria;

public class GetMatchCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public override string GetSettingKey() => "NAP_SpecialDelete_VoidByCurrency_MatchInfo_Select";

    public override bool IsValid() => MatchId > 0;
}