using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface InsertAutoVoidRequestQueueService
{
    Task Execute(int requestId, int actionId);
}

public class InsertAutoVoidRequestQueueServiceImp : InsertAutoVoidRequestQueueService
{
    private readonly IDynamicRepository repository;

    public InsertAutoVoidRequestQueueServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task Execute(int requestId, int actionId)
    {
        if (CheckCanInsertAutoVoidRequestQueue(actionId))
        {
            var command = new InsertAutoVoidRequestQueueCommand
            {
                RequestIds = requestId.ToString(),
                StatusId = ExecuteStatus.New,
                Action = ActionVoidRequestConstant.QueueAutoVoidList.First(x => x.Id == actionId).Name,
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
            ActionVoidRequestConstant.AutoVoidAllInstantId,
            ActionVoidRequestConstant.AutoVoidAllInstantWithOutPolicyId,
            ActionVoidRequestConstant.AutoVoidAll5mBeforeKickOffId,
            ActionVoidRequestConstant.AutoVoidAll10mBeforeKickOffId
        };

        return actionAutoVoidInstants.Contains(actionId);
    }
}