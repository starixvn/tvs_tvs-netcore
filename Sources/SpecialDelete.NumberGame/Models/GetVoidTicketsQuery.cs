namespace SpecialDelete.NumberGame.Models;

public class GetVoidTicketsQuery
{
    public int MatchId { get; set; }

    public DateTime FromTransDate { get; set; }

    public DateTime ToTransDate { get; set; }

    public string BetTypes { get; set; }

    public string BallSequence { get; set; }

    public bool Option { get; set; }

    public string TransIds { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }
}