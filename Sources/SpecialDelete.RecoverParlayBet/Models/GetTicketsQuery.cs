namespace SpecialDelete.RecoverParlayBet.Models;

public class GetMainTicketsQuery
{
    public string BetType { get; set; }

    public string TransIds { get; set; }

    public bool IsOnlyReadPermission { get; set; }
}

public class GetSubTicketsQuery : GetMainTicketsQuery
{
    public int MatchId { get; set; }
}