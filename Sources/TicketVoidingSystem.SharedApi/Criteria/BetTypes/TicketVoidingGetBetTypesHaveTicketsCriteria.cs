using System;
using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SharedApi.Criteria.BetTypes;

public class TicketVoidingGetBetTypesHaveTicketsCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public DateTime? FromTransDate { get; set; }

    public DateTime? ToTransDate { get; set; }

    public bool IsGetCancelCashOut { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_GetBetTypesHaveTickets");

    public override bool IsValid() => MatchId > 0;
}