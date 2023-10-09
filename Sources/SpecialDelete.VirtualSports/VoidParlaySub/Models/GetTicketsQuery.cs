namespace SpecialDelete.VirtualSports.VoidParlaySub.Models;

public class GetTicketsQuery
{
    public int? MatchId { get; set; }

    public string BetTypes { get; set; }

    public string SubTransIds { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }
}

public class ExportExcelQuery : GetTicketsQuery
{
    public string MatchCode { get; set; }

    public string MatchEvent { get; set; }

    public DateTime EventDate { get; set; }
}