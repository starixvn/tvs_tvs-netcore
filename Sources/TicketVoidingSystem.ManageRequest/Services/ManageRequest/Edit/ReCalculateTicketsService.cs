using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;

public interface ReCalculateTicketsService
{
    Task<IEnumerable<Result>> Execute(AbnormalBetViewModel? abnormalBetInfo, int issueTypeId, string transIds);
}

public class ReCalculateTicketsServiceImp : ReCalculateTicketsService
{
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;
    private readonly LoggingService loggingService;

    public ReCalculateTicketsServiceImp(IDynamicRepository repository, SessionService sessionService, LoggingService loggingService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
        this.loggingService = loggingService;
    }

    public async Task<IEnumerable<Result>> Execute(AbnormalBetViewModel? abnormalBetInfo, int issueTypeId, string transIds)
    {
        var results = new List<Result>();
        try
        {
            if (issueTypeId.IsAbnormalBet() && !string.IsNullOrWhiteSpace(transIds) && abnormalBetInfo.IsConfirmCalculator)
            {
                var matchId = abnormalBetInfo.FilterBy is FilterByConstant.MixParlay or FilterByConstant.SystemParlay ? 29 : 0;

                results = (await ExecuteParallel(matchId, transIds)).ToList();
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
        var command = new ReCalculateTicketCommand
        {
            MatchId = matchId,
            TransIds = transIds,
            UserId = sessionService.UserId,
            Ip = sessionService.GetClientIp()
        };

        var tasks = SiteDbGroupConstant.ServerList.Select(item =>
        {
            command.SiteDbGroupId = item.Id;
            repository.ExecuteAsync(command);
            return Task.FromResult(new Result { ErrorCode = command.ErrCode, ErrorMsg = command.ErrMsg });
        });

        return await Task.WhenAll(tasks);
    }
}