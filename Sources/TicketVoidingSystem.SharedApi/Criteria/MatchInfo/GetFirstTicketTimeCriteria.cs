using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.MatchInfo;

public class GetFirstTicketTimeCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public override string GetSettingKey() => "NAP_SpecialDelete_Match_FirstTicketTime_Select";

    public override bool IsValid() => true;
}