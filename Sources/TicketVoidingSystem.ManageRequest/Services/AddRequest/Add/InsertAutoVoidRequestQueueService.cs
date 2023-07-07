using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface InsertAutoVoidRequestQueueService
{
    Task Execute(AddRequestQuery query, int requestId);
}

public class InsertAutoVoidRequestQueueServiceImp : InsertAutoVoidRequestQueueService
{
    private readonly IDynamicRepository repository;

    public InsertAutoVoidRequestQueueServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task Execute(AddRequestQuery query, int requestId)
    {
        if (CheckCanInsertAutoVoidRequestQueue(query.ActionId))
        {
            var command = new InsertAutoVoidRequestQueueCommand
            {
                RequestIds = requestId.ToString(),
                IssueTypeId = query.IssueTypeId,
                MatchId = query.MatchId,
                ActionId = query.ActionId,
                BroadcastSessionId = Guid.NewGuid().ToString()
            };

            await InsertAutoVoidRequestQueueForAllServer(command);
        }
    }

    private async Task InsertAutoVoidRequestQueueForAllServer(InsertAutoVoidRequestQueueCommand command)
    {
        var tasks = SiteDbGroupConstant.ServerList.Select(item =>
        {
            command.SiteDbGroupId = item.Id;
            return repository.ExecuteAsync(command);
        });

        await Task.WhenAll(tasks);
    }

    private static bool CheckCanInsertAutoVoidRequestQueue(int actionId)
    {
        var actionAutoVoidInstants = new List<int>
        {
            ActionVoidRequestConstant.AutoVoidAllInstant,
            ActionVoidRequestConstant.AutoVoidAll5mBeforeKickOff,
            ActionVoidRequestConstant.AutoVoidAll10mBeforeKickOff,
            ActionVoidRequestConstant.AutoVoidAllInstantWithOutPolicy
        };

        return actionAutoVoidInstants.Contains(actionId);
    }
}