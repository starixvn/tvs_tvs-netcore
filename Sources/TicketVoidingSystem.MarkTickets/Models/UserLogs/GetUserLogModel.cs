using System;
using System.Collections.Generic;

namespace TicketVoidingSystem.MarkTickets.Models.UserLogs;

public class GetUserLogModel
{
    public int SessionId { get; set; }

    public DateTime CreatedDate { get; set; }

    public int LogActionId { get; set; }

    public int MatchId { get; set; }

    public int HomeId { get; set; }

    public int AwayId { get; set; }

    public int SportType { get; set; }

    public string LogData { get; set; }

    public IEnumerable<string> TransIds { get; set; }

    public string DoneBy { get; set; }

    public string HTScore { get; set; }

    public string FTScore { get; set; }

    public DateTime KickOffTime { get; set; }

    public int? ChildMatchId { get; set; }
}