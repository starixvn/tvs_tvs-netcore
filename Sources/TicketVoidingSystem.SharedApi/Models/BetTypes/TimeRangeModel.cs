using System;

namespace TicketVoidingSystem.SharedApi.Models.BetTypes;

public class TimeRangeModel
{
    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }
}