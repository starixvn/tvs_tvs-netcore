using TicketVoidingSystem.TicketListing.Models;

namespace TicketVoidingSystem.TicketListing.Criteria;

public class GetDetailQuery : CommonQuery
{
    public string LicenseeName { get; set; }
}

public class GetTicketsDetailQuery : GetDetailQuery
{
    public int PageIndex { get; set; }

    public int PageSize { get; set; }
}

public class SendFileQuery : GetDetailQuery
{
    public string BetTypeName { get; set; }

    public string? MatchCode { get; set; }

    public DateTime EventDate { get; set; }

    public DateTime GlobalShowTime { get; set; }

    public string? MatchEvent { get; set; }

    public string? Title { get; set; }

    public bool IsChinaView { get; set; }

    public int SpecialPlatform { get; set; }
}

public class ExportExcelQuery : SendFileQuery
{
    public int GroupBy { get; set; }

    public bool IsGroup { get; set; }

    public int TotalCreditTickets { get; set; }

    public IEnumerable<ExcelTicketModel> Tickets { get; set; }
}