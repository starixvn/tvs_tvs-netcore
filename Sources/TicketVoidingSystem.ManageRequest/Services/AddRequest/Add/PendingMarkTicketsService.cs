using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface PendingMarkTicketsService
{
    Task PendingMarkTickets(int requestId, string siteDBDownInfoJson, int? actionId, bool isUpdateRequest);
}

public class PendingMarkTicketsServiceImp(IDynamicRepository repository) : PendingMarkTicketsService
{
    public async Task PendingMarkTickets(int requestId, string siteDBDownInfoJson, int? actionId, bool isUpdateRequest)
    {
        if (isUpdateRequest && actionId is ActionVoidRequestConstant.TakeNoteId)
        {
            await DeletePendingMarkTickets(requestId, actionId);
        }
        else
        {
            if (string.IsNullOrEmpty(siteDBDownInfoJson))
            {
                return;
            }

            await Execute(requestId, siteDBDownInfoJson, actionId);
        }
    }

    private async Task DeletePendingMarkTickets(int requestId, int? actionId)
    {
        await Execute(requestId, null, actionId);
    }

    private async Task Execute(int requestId, string siteDBDownInfoJson, int? actionId)
    {
        var command = new PendingMarkTicketsCommand
        {
            RequestId = requestId,
            ActionId = actionId,
            SiteDBDownInfoJson = siteDBDownInfoJson
        };

        await repository.ExecuteAsync(command);
    }
}