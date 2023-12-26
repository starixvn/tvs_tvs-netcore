using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.RecoverBet.Criteria;

public class GetTicketsCriteria : CriteriaBase
{
    public string TransIds { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_BettransSelRecoverBet");

    public override bool IsValid() => true;
}