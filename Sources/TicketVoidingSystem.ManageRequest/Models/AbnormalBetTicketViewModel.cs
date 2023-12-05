using Epplus.Mapper.Annotations;

namespace TicketVoidingSystem.ManageRequest.Models;

public class AbnormalBetTicketViewModel
{
    [Cell("A2")]
    public int No { get; set; }
    [Cell("B2")]
    public string Member { get; set; }
    [Cell("C2")]
    public string BetId { get; set; }
    [Cell("D2")]
    public string MatchId { get; set; }
    [Cell("E3")]
    public string LeagueName { get; set; }
    [Cell("F2")]
    public string MatchEvent { get; set; }
    [Cell("G2")]
    public string TransDate { get; set; }
    [Cell("H2")]
    public string BetType { get; set; }
    [Cell("I2")]
    public string Odds { get; set; }
    [Cell("J2")]
    public string Stake { get; set; }
    [Cell("K2")]
    public string WinLoss { get; set; }
    [Cell("L2")]
    public string Currency { get; set; }
    [Cell("M2")]
    public string Status { get; set; }
    [Cell("N2")]
    public string Score { get; set; }
    [Cell("O2")]
    public string Hdp { get; set; }
    [Cell("P2")]
    public string Choice { get; set; }
    [Cell("Q2")]
    public string Remark { get; set; }
    [Cell("R2")]
    public string Vip { get; set; }
    [Cell("S2")]
    public string CustomerClass { get; set; }
}
