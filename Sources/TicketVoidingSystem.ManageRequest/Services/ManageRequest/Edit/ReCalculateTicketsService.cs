using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;

public interface ReCalculateTicketsService
{
    Task<IEnumerable<Result>> Execute(int? matchId, string transIds);
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

    public async Task<IEnumerable<Result>> Execute(int? matchId, string transIds)
    {
        var results = new List<Result>();
        try
        {
            results = (await ExecuteParallel(matchId, transIds)).ToList();
        }
        catch (Exception e)
        {
            results.Add(new Result { ErrorCode = 1, ErrorMsg = e.Message });
            await loggingService.ErrorAsync(e);
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

        var tasks = SiteDbGroupConstant.ServerList.Select(async item =>
        {
            command.SiteDbGroupId = item.Id;
            await repository.ExecuteAsync(command);
            return new Result { ErrorCode = command.ErrCode, ErrorMsg = command.ErrMsg };
        });

        return await Task.WhenAll(tasks);
    }
}