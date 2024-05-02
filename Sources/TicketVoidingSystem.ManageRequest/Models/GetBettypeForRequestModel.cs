namespace TicketVoidingSystem.ManageRequest.Models;

public class GetBettypeForRequestModel
{
    public long BetId { get; set; }

    public int Bettype { get; set; }

    public int RequestId { get; set; }

    public int MatchId { get; set; }
}