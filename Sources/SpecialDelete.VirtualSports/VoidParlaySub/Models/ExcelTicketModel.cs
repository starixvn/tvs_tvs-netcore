using Epplus.Mapper.Annotations;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Models;

public class ExcelTicketModel
{
    [Cell("A8")]
    public int No { get; set; }

    [Cell("B8")]
    public string BetId { get; set; }

    [Cell("C8")]
    public string Member { get; set; }

    [Cell("E8")]
    public string Odds { get; set; }

    [Cell("D8")]
    public string TransDate { get; set; }

    [Cell("F8")]
    public string Stake { get; set; }

    [Cell("G8")]
    public string WinLoss { get; set; }

    [Cell("H8")]
    public string Status { get; set; }

    [Cell("I8")]
    public string Choice { get; set; }
}