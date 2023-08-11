namespace TicketVoidingSystem.ManageRequest.Models;

public class MatchInfoAddRequest
{
    public int MatchId { get; set; }
    public int HomeId { get; set; }
    public int AwayId { get; set; }
    public int LeagueId { get; set; }
    public int SportType { get; set; }
    public bool IsNeutral { get; set; }
    public string HomeName { get; set; }
    public string AwayName { get; set; }
    public string MatchCode { get; set; }
    public string MatchEvent { get; set; }
    public string Name { get; set; }
    public string LeagueName { get; set; }
    public int MatchType { get; set; }
    public int ParentId { get; set; }
}