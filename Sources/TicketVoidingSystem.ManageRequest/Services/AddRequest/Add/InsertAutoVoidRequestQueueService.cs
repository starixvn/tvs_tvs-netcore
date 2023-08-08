using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface InsertAutoVoidRequestQueueService
{
    Task Execute(int requestId, int issueTypeId, int? matchId, int actionId);
}

public class InsertAutoVoidRequestQueueServiceImp : InsertAutoVoidRequestQueueService
{
    private readonly IDynamicRepository repository;

    public InsertAutoVoidRequestQueueServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task Execute(int requestId, int issueTypeId, int? matchId, int actionId)
    {
        if (CheckCanInsertAutoVoidRequestQueue(actionId))
        {
            var command = new InsertAutoVoidRequestQueueCommand
            {
                RequestIds = requestId.ToString(),
                IssueTypeId = issueTypeId,
                MatchId = matchId ?? 0,
                ActionId = actionId,
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