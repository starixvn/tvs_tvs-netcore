using Epplus.Mapper.Annotations;

namespace SpecialDelete.NumberGame.Models;

public class ExcelTicketModel
{
    [Cell("A5")]
    public int No { get; set; }

    [Cell("B5")]
    public string BetId { get; set; }

    [Cell("C5")]
    public string Member { get; set; }

    [Cell("E5")]
    public string BetType { get; set; }

    [Cell("D5")]
    public string TransDate { get; set; }

    [Cell("F5")]
    public string Odds { get; set; }

    [Cell("G5")]
    public string Stake { get; set; }

    [Cell("H5")]
    public string WinLost { get; set; }

    [Cell("I5")]
    public string CurrencyName { get; set; }

    [Cell("J5")]
    public string Status { get; set; }

    [Cell("K5")]
    public string Creator { get; set; }

    [Cell("L5")]
    public byte? BallSequence { get; set; }

    [Cell("M5")]
    public string Choice { get; set; }
}