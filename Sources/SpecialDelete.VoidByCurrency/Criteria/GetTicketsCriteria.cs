using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VoidByCurrency.Criteria;

public class GetTicketsCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public string LicenseeNames { get; set; }

    public string TicketType { get; set; }

    public string CurrencyIds { get; set; }

    public bool IsOutright { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_VoidByCurrency_Select");

    public override bool IsValid() => MatchId > 0;
}