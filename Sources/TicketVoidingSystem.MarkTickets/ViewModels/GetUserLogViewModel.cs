namespace TicketVoidingSystem.MarkTickets.ViewModels;

using System;
using System.Collections.Generic;

public class GetUserLogViewModel
{
    public int No { get; set; }

    public int ActionId { get; set; }

    public DateTime LogDate { get; set; }

    public string Action { get; set; }

    public int MatchId { get; set; }

    public string Event { get; set; }

    public string HTScore { get; set; }

    public string FTScore { get; set; }

    public IEnumerable<string> SingleTickets { get; set; }

    public IEnumerable<string> ParlayTickets { get; set; }

    public string DoneBy { get; set; }

    public DateTime KickOffTime { get; set; }
}