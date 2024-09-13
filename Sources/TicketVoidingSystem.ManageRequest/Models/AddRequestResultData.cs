using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Models;

public class AddRequestResultData
{
    public string MatchId { get; set; }
    public int RequestId { get; set; }

    public IEnumerable<Result> LogResults { get; set; }
    public string LogStageName { get; set; }
    public IEnumerable<long> MarkedTicketsSuccessful { get; set; }
}