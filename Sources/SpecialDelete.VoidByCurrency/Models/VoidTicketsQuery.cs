using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendMessage;

namespace SpecialDelete.VoidByCurrency.Models;

public class VoidTicketsQuery
{
    public IEnumerable<BetId> Tickets { get; set; }

    public int MatchId { get; set; }

    public string LicenseeNames { get; set; }

    public string CurrencyIds { get; set; }

    public string TicketType { get; set; }

    public string SoldTransIds { get; set; }

    public IEnumerable<BetId> CricketTransIds { get; set; }

    public Message Message { get; set; }

    public string UserName { get; set; }

    public string UserPassword { get; set; }

    public string Reason { get; set; }

    public string ReasonSC { get; set; }

    public string NegativeBalanceUsers { get; set; }

    public Match Match { get; set; }

    public string VoidFromTime { get; set; }

    public string VoidToTime { get; set; }

    public bool IsOutright { get; set; }
}