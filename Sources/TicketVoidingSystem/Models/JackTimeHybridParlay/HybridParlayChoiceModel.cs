namespace TicketVoidingSystem.Models.JackTimeHybridParlay;

public class HybridParlayChoiceModel
{
    public string RefNo { get; set; }
    public string Transdesc { get; set; }
    public string SubTransId { get; set; }
    public int Hdp1 { get; set; }
    public int Hdp2 { get; set; }
    public string BetCheck { get; set; }
    public string BetTeam { get; set; }
    public string Currency { get; set; }
    public decimal Stake { get; set; }
}