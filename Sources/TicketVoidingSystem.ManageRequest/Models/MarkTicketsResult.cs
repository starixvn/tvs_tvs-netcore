using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Models;

public class MarkTicketsResult
{
    public IEnumerable<Result> MarkedResults { get; set; }
    public IEnumerable<long> MarkedTickets { get; set; }
}