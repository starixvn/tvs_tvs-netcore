using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SharedApi.Criteria.BetTypes;

public class GetBetTypesHaveTicketsCriteria : CriteriaBase
{
    public byte Mode { get; set; }

    public int MatchId { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_GetBetTypesHaveTickets");

    public override bool IsValid() => true;
}