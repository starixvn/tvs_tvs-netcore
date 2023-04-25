using System;

namespace TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;

public class AllMarkedTicketModel
{
    public int MatchId { get; set; }

    public string HTScore { get; set; }

    public string FTScore { get; set; }

    public DateTime KickOffTime { get; set; }

    public int UserId { get; set; }

    public string Username { get; set; }

    public DateTime CreatedDate { get; set; }

    public int HomeId { get; set; }

    public int AwayId { get; set; }

    public int Total { get; set; }
    public int ChildMatchId { get; set; }
}