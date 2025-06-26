using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VoidByBetId.Criteria;

public class GetTicketsCriteria : CriteriaBase
{
    public string TransIds { get; set; }

    public bool IncludeMainParlay { get; set; }

    public byte? AbnormalBetType { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_VoidBetIdList_Sel");

    public override bool IsValid() => !string.IsNullOrWhiteSpace(TransIds);
}