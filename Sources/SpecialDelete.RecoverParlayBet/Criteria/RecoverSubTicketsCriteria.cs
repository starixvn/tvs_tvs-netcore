using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.RecoverParlayBet.Criteria;

public class RecoverSubTicketsCriteria : CriteriaBase
{
    public string MainTransIds { get; set; }

    public int UserId { get; set; }

    public string Ip { get; set; }

    public long MatchId { get; set; }

    public bool IsCalledJackTimeHybridParlay { get; set; }

    public string BetType { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_BettransRecoverParlayBet_Sub");

    public override bool IsValid() => !string.IsNullOrWhiteSpace(MainTransIds);
}