using Epplus.Mapper.Annotations;

namespace TicketVoidingSystem.TicketListing.Models;

public class ExcelTicketModel
{
    [Cell("A8")]
    public string BetId { get; set; }

    [Cell("B8")]
    public string TransDate { get; set; }

    [Cell("C8")]
    public string Member { get; set; }

    [Cell("D8")]
    public string Choice { get; set; }

    [Cell("E8")]
    public string Odds { get; set; }

    [Cell("F8")]
    public string Stake { get; set; }

    [Cell("G8")]
    public decimal? WinLoss { get; set; }

    [Cell("H8")]
    public string Currency { get; set; }

    [Cell("I8")]
    public string BetType { get; set; }

    [Cell("J8")]
    public byte? BallSequence { get; set; }

    [Cell("K8")]
    public string Status { get; set; }

    [Cell("L8")]
    public string Sa { get; set; }
}