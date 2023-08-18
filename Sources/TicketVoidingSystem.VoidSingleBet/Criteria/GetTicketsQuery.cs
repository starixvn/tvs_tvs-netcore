using System.Security;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.VoidSingleBet.Criteria;

public class CommonQuery
{
    public int MatchId { get; set; }

    public string Bet { get; set; }

    public string OddsType { get; set; }

    public string? OddsValue { get; set; }

    public string? OddsFilter => string.IsNullOrWhiteSpace(OddsValue)
        ? null
        : $"<root><r o='{SecurityElement.Escape(OddsValue)}' ost='{OddsType}'/></root>";

    public DateTime? FromTransDate { get; set; }

    public DateTime? ToTransDate { get; set; }

    public int EventType { get; set; }

    public short? LiveHomeScore { get; set; }

    public short? LiveAwayScore { get; set; }

    public List<BetTypeXml> BetTypes { get; set; }

    public byte TicketType { get; set; }

    public byte TimeType { get; set; }

    public string? VoidFromTime { get; set; }

    public string? VoidToTime { get; set; }

    public string SelectionSubParlays { get; set; }

    public bool IsCheckTime { get; set; }
}

public class GetTicketsQuery : CommonQuery
{
    public string SettledType { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }

    public Match? Match { get; set; }
}