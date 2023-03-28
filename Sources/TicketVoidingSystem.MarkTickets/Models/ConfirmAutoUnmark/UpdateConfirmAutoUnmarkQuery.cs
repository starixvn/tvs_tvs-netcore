namespace TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;

public class UpdateConfirmAutoUnmarkQuery
{
    public int MatchId { get; set; }
    public int Bettype { get; set; }
    public int MarkedBy { get; set; }
    public long? BetId { get; set; }
}