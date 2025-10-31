namespace TicketVoidingSystem.Models;

public class BetId
{
    public string TransId { get; set; }
    public int SiteDbGroupId { get; set; }
    public int? MatchId { get; set; }
    public bool IsHybrid { get; set; }
    public int SubBetType { get; set; }
}