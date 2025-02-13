using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Criteria;

public class LockMatchCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public int Type { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_TicketVoiding_NetPosition");

    public override bool IsValid() => MatchId > 0;
}