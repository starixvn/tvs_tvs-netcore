using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.OnlineServerRepository;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;

public interface ReCalculateTicketsService
{
    Task<IEnumerable<Result>> Execute(AbnormalBetViewModel? abnormalBetInfo, int issueTypeId, string transIds);
}

public class ReCalculateTicketsServiceImp(
    OnlineServerRepository onlineServerRepository,
    SessionService sessionService,
    LoggingService loggingService)
    : ReCalculateTicketsService
{
    public async Task<IEnumerable<Result>> Execute(AbnormalBetViewModel? abnormalBetInfo, int issueTypeId, string transIds)
    {
        var results = new List<Result>();
        try
        {
            if (issueTypeId.IsAbnormalBet() && !string.IsNullOrWhiteSpace(transIds) && abnormalBetInfo.IsConfirmCalculator)
            {
                var matchId = abnormalBetInfo.FilterBy is FilterByConstant.MixParlay or FilterByConstant.SystemParlay ? 29 : 0;
                var x = await ExecuteParallel(matchId, transIds);
                results = [.. x];
            }
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync(e);
            results.Add(new Result { ErrorCode = 1, ErrorMsg = e.Message });
        }

        return results;
    }

    private async Task<IEnumerable<Result>> ExecuteParallel(int? matchId, string transIds)
    {
        var criteria = new ReCalculateTicketCommand
        {
            MatchId = matchId,
            TransIds = transIds,
            UserId = sessionService.UserId,
            Ip = sessionService.GetClientIp()
        };

        return await onlineServerRepository.FetchAsync<Result>(criteria);
    }
}