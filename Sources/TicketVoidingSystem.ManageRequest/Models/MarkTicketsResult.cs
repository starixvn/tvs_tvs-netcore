using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Models;

public class MarkTicketsResult
{
    public IEnumerable<Result> MarkResults { get; set; }
    public IEnumerable<long> MarkTransId { get; set; }
}