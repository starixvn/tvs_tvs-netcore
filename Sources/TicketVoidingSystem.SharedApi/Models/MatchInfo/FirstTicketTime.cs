using System;

namespace TicketVoidingSystem.SharedApi.Models.MatchInfo;

public class FirstTicketTime
{
    public DateTime MinTransDate { get; set; }

    public DateTime KickOffTime { get; set; }
}