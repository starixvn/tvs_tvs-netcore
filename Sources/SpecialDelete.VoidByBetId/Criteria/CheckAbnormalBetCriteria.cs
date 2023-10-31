using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VoidByBetId.Criteria;

public class CheckAbnormalBetCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public string TransIds { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_VoidBetId_CheckAbnormalBet");

    public override bool IsValid() => MatchId > 0;
}