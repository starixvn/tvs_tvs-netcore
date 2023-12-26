using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.RecoverParlayBet.Criteria;

public class GetSubTicketsCriteria : CriteriaBase
{
    public string BetType { get; set; }

    public long MatchId { get; set; }

    public string TransIds { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_BettransSelRecoverParlayBet_Sub");

    public override bool IsValid()
    {
        return MatchId > 0 && !string.IsNullOrWhiteSpace(TransIds);
    }
}