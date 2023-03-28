using System;

namespace TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;

public class ConfirmAutoUnmarkModel
{
    public int MatchId { get; set; }

    public string HTScore { get; set; }

    public string FTScore { get; set; }

    public int Bettype { get; set; }

    public string BetId { get; set; }

    public DateTime KickOffTime { get; set; }

    public int HomeId { get; set; }

    public int AwayId { get; set; }

    public int UserId { get; set; }

    public string MarkedBy { get; set; }

    public int MarkedTrans { get; set; }

    public bool IsConfirm { get; set; }

    public int SportType { get; set; }

    public int MarkType { get; set; }
}