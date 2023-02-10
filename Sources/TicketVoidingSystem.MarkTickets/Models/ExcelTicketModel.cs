namespace TicketVoidingSystem.MarkTickets.Models;

using Epplus.Mapper.Annotations;

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
    public string Currency { get; set; }

    [Cell("I8")]
    public string Status { get; set; }

    [Cell("J8")]
    public string Choice { get; set; }
}