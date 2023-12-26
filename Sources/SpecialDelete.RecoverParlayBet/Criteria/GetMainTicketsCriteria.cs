using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.RecoverParlayBet.Criteria;

public class GetMainTicketsCriteria : CriteriaBase
{
    public string BetType { get; set; }

    public string TransIds { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_BettransSelRecoverParlayBet_Main");

    public override bool IsValid() => !string.IsNullOrWhiteSpace(TransIds);
}