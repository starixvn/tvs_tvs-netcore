namespace TicketVoidingSystem.MarkTickets.ViewModels;

using System;

public class AllMarkedTicketViewModel
{
    public int No { get; set; }

    public int MatchId { get; set; }

    public string HTScore { get; set; }

    public string FTScore { get; set; }

    public DateTime KickOffTime { get; set; }

    public int UserId { get; set; }

    public string Username { get; set; }

    public DateTime CreatedDate { get; set; }

    public string Event { get; set; }

    public int Total { get; set; }

    public bool IsChecked { get; set; }

}