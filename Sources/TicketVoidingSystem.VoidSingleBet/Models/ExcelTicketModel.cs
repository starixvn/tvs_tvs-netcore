using Epplus.Mapper.Annotations;

namespace TicketVoidingSystem.VoidSingleBet.Models;

public class ExcelTicketModel
{
    [Cell("A8")]
    public int No { get; set; }

    [Cell("B8")]
    public string BetId { get; set; }

    [Cell("C8")]
    public string TransDate { get; set; }

    [Cell("D8")]
    public string Member { get; set; }

    [Cell("E8")]
    public string BetType { get; set; }

    [Cell("F8")]
    public string Odds { get; set; }

    [Cell("G8")]
    public string Stake { get; set; }

    [Cell("H8")]
    public string WinLoss { get; set; }

    [Cell("I8")]
    public string Currency { get; set; }

    [Cell("J8")]
    public string Status { get; set; }

    [Cell("K8")]
    public string Sa { get; set; }

    [Cell("L8")]
    public string Score { get; set; }

    [Cell("M8")]
    public string Handicap { get; set; }

    [Cell("N8")]
    public string Choice { get; set; }
}