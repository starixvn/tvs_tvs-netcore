using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.Services.OnlineServerRepository;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface InsertAutoVoidRequestQueueService
{
    Task Execute(int requestId, int? actionId, IEnumerable<int> matchIds);

    IEnumerable<int> GetMatchIdsInRequest(AbnormalBetViewModel? abnormalBetInfo,
        IEnumerable<EarlyKickOffViewModel>? earlyKickOffInfo, WrongOfferedNameViewModel? wrongOfferedNameInfo);
}

public class InsertAutoVoidRequestQueueServiceImp(OnlineServerRepository onlineServerRepository) : InsertAutoVoidRequestQueueService
{
    public async Task Execute(int requestId, int? actionId, IEnumerable<int> matchIds)
    {
        if (CheckCanInsertAutoVoidRequestQueue(actionId))
        {
            if (matchIds.Any())
            {
                await ExecuteForAutoVoidInstantMultipleMatches(requestId, actionId, matchIds);
            }
            else
            {
                await InsertAutoVoidRequestQueueForAllServer(Guid.NewGuid().ToString(), requestId, actionId, null);
            }
        }
    }

    private async Task ExecuteForAutoVoidInstantMultipleMatches(int requestId, int? actionId, IEnumerable<int> matchIds)
    {
        foreach (var matchId in matchIds)
        {
            var broadcastSessionId = Guid.NewGuid().ToString();
            await InsertAutoVoidRequestQueueForAllServer(broadcastSessionId, requestId, actionId, matchId);
        }
    }

    private async Task InsertAutoVoidRequestQueueForAllServer(string broadcastSessionId, int requestId, int? actionId, int? matchId)
    {
        var command = new InsertAutoVoidRequestQueueCommand
        {
            RequestIds = requestId.ToString(),
            MatchId = matchId,
            StatusId = ExecuteStatus.New,
            Action = ActionVoidRequestConstant.QueueAutoVoidList.First(x => x.Id == actionId).Name,
            BroadcastSessionId = broadcastSessionId
        };
        await onlineServerRepository.ExecuteAsync(command);
    }

    public IEnumerable<int> GetMatchIdsInRequest(AbnormalBetViewModel? abnormalBetInfo, IEnumerable<EarlyKickOffViewModel>? earlyKickOffInfo, WrongOfferedNameViewModel? wrongOfferedNameInfo)
    {
        if (abnormalBetInfo != null)
        {
            return abnormalBetInfo.FilterBy is FilterByConstant.MixParlay or FilterByConstant.SystemParlay or FilterByConstant.HybridParlay
                ? new List<int> { BetTypeConstant.SystemParlay }
                : abnormalBetInfo.Matches?.Select(x => x.MatchId);
        }

        if (earlyKickOffInfo != null)
        {
            return earlyKickOffInfo.Select(x => x.MatchId);
        }

        return wrongOfferedNameInfo != null ? new List<int> { wrongOfferedNameInfo.MatchId } : [];
    }

    private static bool CheckCanInsertAutoVoidRequestQueue(int? actionId)
    {
        var actionAutoVoidInstants = new List<int?>
        {
            ActionVoidRequestConstant.AutoVoidAllInstantId,
            ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId,
            ActionVoidRequestConstant.AutoVoidAllInstantWithOutPolicyId,
            ActionVoidRequestConstant.AutoRecoverId
        };

        return actionAutoVoidInstants.Contains(actionId);
    }
}