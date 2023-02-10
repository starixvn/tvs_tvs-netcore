namespace TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;

public class GetDataForConfirmAutoUnmarkQuery
{
    public string MatchId { get; set; }

    public string SportType { get; set; }

    public int MarkedBy { get; set; }

    public bool IsExcludeTest { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }
}