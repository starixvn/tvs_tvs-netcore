using System;

namespace TicketVoidingSystem.SharedApi.Models.BetTypes;

public class BetTypeQueryModel
{
    public byte Mode { get; set; }

    public int MatchId { get; set; }

    public string BetTypes { get; set; }

    public DateTime? FromTransDate { get; set; }

    public DateTime? ToTransDate { get; set; }
}