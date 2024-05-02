namespace TicketVoidingSystem.ManageRequest.Models;

public class OWPData
{
    public int MatchId { get; set; }
    public string TV { get; set; }
    public string IPTV { get; set; }
}

public class MatchEventDate
{
    public int MatchId { get; set; }
    public DateTime EventDate { get; set; }
}