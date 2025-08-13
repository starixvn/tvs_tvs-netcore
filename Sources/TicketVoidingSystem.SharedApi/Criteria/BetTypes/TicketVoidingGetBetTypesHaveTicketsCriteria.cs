using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SharedApi.Criteria.BetTypes;

public class TicketVoidingGetBetTypesHaveTicketsCriteria : OnlineServerCriteriaBase
{
    public int MatchId { get; set; }

    public string? TimeRangeJson { get; set; }

    public bool IsGetCancelCashOut { get; set; }

    public string OnlineServerId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_GetBetTypesHaveTickets");

    public override bool IsValid() => MatchId > 0;
}