using Fanex.Data.Repository;

namespace TicketVoidingSystem.Criteria;

public class GetMatchInfoCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public bool IsMatch3rd { get; set; }

    public int Type { get; set; }

    public bool? IsExcludeChildMatchCricket { get; set; }

    public override string GetSettingKey() => "NAP_SpecialDelete_MatchInfo_Select";

    public override bool IsValid() => MatchId > 0;
}