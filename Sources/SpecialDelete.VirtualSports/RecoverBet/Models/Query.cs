using TicketVoidingSystem.Models;

namespace SpecialDelete.VirtualSports.RecoverBet.Models;

public enum Recover
{
    None,
    Single,
    SubParlay,
    MainParlay
}

public class Query
{
    public string TicketType { get; set; }

    public string? Type { get; set; }

    public int? MatchId { get; set; }

    public string? TransIds { get; set; }

    public IEnumerable<BetId>? Tickets { get; set; }

    public Recover TypeOfRecover => GetTypeOfRecover();

    private Recover GetTypeOfRecover()
    {
        if (TicketType.Equals("Single", StringComparison.OrdinalIgnoreCase))
        {
            return Recover.Single;
        }

        if (!string.IsNullOrEmpty(Type) && Type.Equals("Sub", StringComparison.OrdinalIgnoreCase))
        {
            return Recover.SubParlay;
        }

        return Recover.MainParlay;
    }
}