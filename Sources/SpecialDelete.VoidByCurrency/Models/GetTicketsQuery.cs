namespace SpecialDelete.VoidByCurrency.Models;

public class GetTicketsQuery
{
    public int MatchId { get; set; }

    public string LicenseeNames { get; set; }

    public string TicketType { get; set; }

    public string CurrencyIds { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }

    public bool IsOutright { get; set; }
}