using System.Collections.Generic;

namespace TicketVoidingSystem.SharedApi.Models.BetTypes;

public class BetTypeQueryModel
{
    public byte Mode { get; set; }

    public int MatchId { get; set; }

    public string BetTypes { get; set; }

    public IEnumerable<TimeRangeModel> TimeRanges { get; set; }

    public bool IsGetCancelCashOut { get; set; }
}