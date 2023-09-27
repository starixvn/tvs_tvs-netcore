using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VirtualSports.RecoverBet.Criteria;

public class RecoverTicketsCriteria : CriteriaBase
{
    public string TicketType { get; set; }

    public string Type { get; set; }

    public int? MatchId { get; set; }

    public string TransIds { get; set; }

    public int UserId { get; set; }

    public string Ip { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_RecoverVSBetRadar_Upd");

    public override bool IsValid() => !string.IsNullOrWhiteSpace(TransIds);
}