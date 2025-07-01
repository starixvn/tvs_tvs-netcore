using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface PendingMarkTicketsService
{
    Task PendingMarkTickets(int requestId, string siteDBDownInfoJson);
}

public class PendingMarkTicketsServiceImp(IDynamicRepository repository) : PendingMarkTicketsService
{
    public async Task PendingMarkTickets(int requestId, string siteDBDownInfoJson)
    {
        if (!string.IsNullOrEmpty(siteDBDownInfoJson))
        {
            var command = new PendingMarkTicketsCommand
            {
                RequestId = requestId,
                SiteDBDownInfoJson = siteDBDownInfoJson
            };

            await repository.ExecuteAsync(command);
        }
    }
}