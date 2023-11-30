using TicketVoidingSystem.Models;

namespace SpecialDelete.CashOutTransaction.Common.Models;

public class GetTicketsQuery
{
    public long? MatchId { get; set; }

    public int? FilterBy { get; set; }

    public string TransIds { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }

    public IEnumerable<TransDateXmlModel>? Durations { get; set; }
}