using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface InsertAutoVoidRequestQueueService
{
    Task Execute(int requestId, int actionId, int? matchId, IEnumerable<EarlyKickOffViewModel>? earlyKickOffInfo);
}

public class InsertAutoVoidRequestQueueServiceImp : InsertAutoVoidRequestQueueService
{
    private readonly IDynamicRepository repository;

    public InsertAutoVoidRequestQueueServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task Execute(int requestId, int actionId, int? matchId, IEnumerable<EarlyKickOffViewModel>? earlyKickOffInfo)
    {
        if (CheckCanInsertAutoVoidRequestQueue(actionId))
        {
            var matchIds = GetMatchIdsInRequest(earlyKickOffInfo);
            if (matchIds.Any())
            {
                await ExecuteForAutoVoidInstantMultipleMatches(requestId, actionId, matchIds);
            }
            else
            {
                await InsertAutoVoidRequestQueueForAllServer(Guid.NewGuid().ToString(), requestId, actionId);
            }
        }
    }

    private async Task ExecuteForAutoVoidInstantMultipleMatches(int requestId, int actionId, IEnumerable<int> matchIds)
    {
        foreach (var _ in matchIds)
        {
            var broadcastSessionId = Guid.NewGuid().ToString();
            await InsertAutoVoidRequestQueueForAllServer(broadcastSessionId, requestId, actionId);
        }
    }

    private async Task InsertAutoVoidRequestQueueForAllServer(string broadcastSessionId, int requestId, int actionId)
    {
        var command = new InsertAutoVoidRequestQueueCommand
        {
            RequestIds = requestId.ToString(),
            StatusId = ExecuteStatus.New,
            Action = ActionVoidRequestConstant.QueueAutoVoidList.First(x => x.Id == actionId).Name,
            BroadcastSessionId = broadcastSessionId
        };

        var tasks = SiteDbGroupConstant.ServerList.Select(item =>
        {
            command.SiteDbGroupId = item.Id;
            return repository.ExecuteAsync(command);
        });

        await Task.WhenAll(tasks);
    }

    private static IEnumerable<int> GetMatchIdsInRequest(IEnumerable<EarlyKickOffViewModel>? earlyKickOffInfo)
    {
        return earlyKickOffInfo != null ? earlyKickOffInfo.Select(x => x.MatchId) : Enumerable.Empty<int>();
    }

    private static bool CheckCanInsertAutoVoidRequestQueue(int actionId)
    {
        var actionAutoVoidInstants = new List<int>
        {
            ActionVoidRequestConstant.AutoVoidAllInstantId,
            ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId,
            ActionVoidRequestConstant.AutoVoidAllInstantWithOutPolicyId,
            ActionVoidRequestConstant.AutoVoidAll5mBeforeKickOffId,
            ActionVoidRequestConstant.AutoVoidAll10mBeforeKickOffId,
            ActionVoidRequestConstant.AutoRecoverId
        };

        return actionAutoVoidInstants.Contains(actionId);
    }
}