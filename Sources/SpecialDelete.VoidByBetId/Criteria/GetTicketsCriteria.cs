using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VoidByBetId.Criteria;

public class GetTicketsCriteria : CriteriaBase
{
    public string CustId { get; set; }

    public string TransIds { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public bool IncludeMainParlay { get; set; }

    public string Products { get; set; }

    public string StatusIds { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_VoidBetIdList_Sel");

    public override bool IsValid() => !string.IsNullOrWhiteSpace(TransIds) || CustId != "0";
}