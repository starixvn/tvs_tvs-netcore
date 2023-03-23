namespace TicketVoidingSystem.SharedApi.Models.SubParlayTicket;

public class QueryComboParlay : QueryNormalParlay
{
    public string BetTeam { get; set; }

    public string BetCheck { get; set; }

    public decimal Handicap1 { get; set; }

    public decimal Handicap2 { get; set; }
}