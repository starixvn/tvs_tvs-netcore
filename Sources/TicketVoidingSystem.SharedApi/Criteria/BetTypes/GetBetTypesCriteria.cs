using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.BetTypes
{
    public class GetBetTypesCriteria : CriteriaBase
    {
        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public byte Mode { get; set; }

        public int MatchId { get; set; }

        public string BetTypes { get; set; }

        public override string GetSettingKey() => "NAP_BetTypeSel";

        public override bool IsValid() => true;
    }
}