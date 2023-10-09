using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Criteria;

public class VoidTicketsCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public string TransIds { get; set; }

    public string UserName { get; set; }

    public string Password { get; set; }

    public int UserId { get; set; }

    public string Reason { get; set; }

    public string ReasonSC { get; set; }

    public string Ip { get; set; }

    public string SearchBy => MatchId > 0 ? "MatchId" : "SubTransIds";

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_VoidParlaySubVSBetRadar_Upd");

    public override bool IsValid() => !string.IsNullOrWhiteSpace(TransIds);
}