using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SharedApi.Criteria.SharedApi;

public class CheckNegativeBetCreditCriteria : CriteriaBase
{
    public string TransIds { get; set; }

    public bool Type { get; set; }

    public bool ExcludeRunning { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_BettransCheckNegativeBalance");

    public override bool IsValid() => true;
}