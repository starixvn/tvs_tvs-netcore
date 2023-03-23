using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SharedApi.Criteria.SubParlayTicket;

public class GetParlaySubBetCriteria : CriteriaBase
{
    public string RefNo { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_BettransSelDetailSpecialDel_MixParlay");

    public override bool IsValid() => !string.IsNullOrWhiteSpace(RefNo);
}