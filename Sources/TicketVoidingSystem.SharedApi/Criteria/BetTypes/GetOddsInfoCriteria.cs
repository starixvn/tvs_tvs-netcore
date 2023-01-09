using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.BetTypes
{
    public class GetOddsInfoCriteria : CriteriaBase
    {
        public int MatchId { get; set; }

        public string BetTypes { get; set; }

        public override string GetSettingKey() => "NAP_SpecialDelete_OddsOSInfo_Select";

        public override bool IsValid() => true;
    }
}