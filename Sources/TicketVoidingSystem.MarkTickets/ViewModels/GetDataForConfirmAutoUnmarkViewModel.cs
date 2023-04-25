using System;
using System.Collections.Generic;

namespace TicketVoidingSystem.MarkTickets.ViewModels;

public class GetDataForConfirmAutoUnmarkViewModel
{
    public IEnumerable<ConfirmAutoUnmarkViewModel> Items { get; set; }

    public int TotalItems { get; set; }
}

public class ConfirmAutoUnmarkViewModel
{
    public int No { get; set; }

    public int MatchId { get; set; }

    public string HTScore { get; set; }

    public string FTScore { get; set; }

    public int Bettype { get; set; }

    public long? BetId { get; set; }

    public string BettypeName { get; set; }

    public DateTime KickOffTime { get; set; }

    public string Event { get; set; }

    public int UserId { get; set; }

    public string MarkedBy { get; set; }

    public int TotalItems { get; set; }

    public bool IsConfirm { get; set; }

    public string SportName { get; set; }

    public int MarkType { get; set; }

    public int ChildMatchId { get; set; }

}