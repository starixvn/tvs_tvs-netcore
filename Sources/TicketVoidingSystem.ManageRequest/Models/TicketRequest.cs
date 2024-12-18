namespace TicketVoidingSystem.ManageRequest.Models;

public class TicketRequest
{
    public int Id { get; set; }

    public int ScoreId { get; set; }

    public int MatchId { get; set; }

    public string TransIds { get; set; }

    public int RequestId { get; set; }

    public string CreatedBy { get; set; }
}