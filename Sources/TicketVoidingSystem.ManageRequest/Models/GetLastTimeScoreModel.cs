namespace TicketVoidingSystem.ManageRequest.Models;

public class GetLastTimeScoreModel
{
    public int ScoreId { get; set; }

    public int MatchId { get; set; }

    public int ActionId { get; set; }

    public int FilterBy { get; set; }

    public DateTime FilterFromTransTime { get; set; }
}