using Epplus.Mapper.Annotations;

namespace SpecialDelete.VoidByBetId.Models;

public class ExcelTicketModel
{
    [Cell("A5")]
    public int No { get; set; }

    [Cell("B5")]
    public string BetId { get; set; }

    [Cell("C5")]
    public string TransDate { get; set; }

    [Cell("D5")]
    public string Member { get; set; }

    [Cell("E5")]
    public string BetType { get; set; }

    [Cell("F5")]
    public string Odds { get; set; }

    [Cell("G5")]
    public string Stake { get; set; }

    [Cell("H5")]
    public string WinLoss { get; set; }

    [Cell("I5")]
    public string Currency { get; set; }

    [Cell("J5")]
    public string Status { get; set; }

    [Cell("K8")]
    public string Sa { get; set; }

    [Cell("L5")]
    public string Score { get; set; }

    [Cell("M5")]
    public string Handicap { get; set; }

    [Cell("N5")]
    public string Choice { get; set; }
}