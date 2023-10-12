using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VoidByCurrency.Criteria;

public class VoidTicketsCriteria : CriteriaBase
{
    public long MatchId { get; set; }

    public string LicenseeNames { get; set; }

    public string CurrencyIds { get; set; }

    public string TransIds { get; set; }

    public string SoldTransIds { get; set; }

    public int UserId { get; set; }

    public string UserName { get; set; }

    public string UserPassword { get; set; }

    public string Reason { get; set; }

    public string ReasonSC { get; set; }

    public string Ip { get; set; }

    public bool IsOutright { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_VoidByCurrency_Update");

    public override bool IsValid() => !string.IsNullOrEmpty(TransIds);
}