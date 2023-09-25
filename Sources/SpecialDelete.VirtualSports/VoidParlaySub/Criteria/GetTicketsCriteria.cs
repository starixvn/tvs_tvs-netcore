using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Criteria;

public class GetTicketsCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public string BetTypes { get; set; }

    public string SubTransIds { get; set; }

    public string SearchBy => MatchId > 0 ? "MatchId" : "SubTransIds";

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_VoidParlaySubVSBetRadar_Sel");

    public override bool IsValid() => MatchId > 0 || !string.IsNullOrWhiteSpace(SubTransIds);
}