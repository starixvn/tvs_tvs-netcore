using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface MarkTicketsService
{
    Task<IEnumerable<Result>> MarkTicketsInTVS(string markTransIds, int issueTypeId, byte markTypeId);
}

public class MarkTicketsServiceImp : MarkTicketsService
{
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;
    private readonly LoggingService loggingService;

    public MarkTicketsServiceImp(IDynamicRepository repository, SessionService sessionService, LoggingService loggingService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
        this.loggingService = loggingService;
    }

    public async Task<IEnumerable<Result>> MarkTicketsInTVS(string markTransIds, int issueTypeId, byte markTypeId)
    {
        try
        {
            return await MarkTicketsInAllSiteDb(markTransIds, issueTypeId, markTypeId);
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync(e);
            return new List<Result> { new() { ErrorCode = 1, ErrorMsg = e.Message } };
        }
    }

    private async Task<IEnumerable<Result>> MarkTicketsInAllSiteDb(string markTransIds, int issueTypeId, byte markTypeId)
    {
        var markTicketsCommand = new MarkTicketsCommand
        {
            TransIds = markTransIds,
            Status = markTypeId,
            IssueTypeId = issueTypeId,
            UserId = sessionService.UserId,
            Ip = sessionService.GetClientIp(),
            LogActionId = LogActionIdConstant.MarkTicketAddRequestTvs
        };

        var tasks = SiteDbGroupConstant.ServerList.Select(x =>
        {
            markTicketsCommand.SiteDbGroupId = x.Id;
            return repository.FetchAsync<Result>(markTicketsCommand);
        });

        var tasksResults = await Task.WhenAll(tasks);
        var resultsInAllServer = tasksResults.SelectMany(data => data);
        return resultsInAllServer;
    }
}