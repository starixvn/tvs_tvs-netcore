using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface MarkTicketsService
{
    Task<MarkTicketsResult> MarkTicketsInTVS(string markTransIds, int issueTypeId, byte markTypeId);
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

    public async Task<MarkTicketsResult> MarkTicketsInTVS(string markTransIds, int issueTypeId, byte markTypeId)
    {
        var tasks = SiteDbGroupConstant.ServerList.Select(x => MarkTicketsSiteDb(x.Id, markTransIds, issueTypeId, markTypeId));
        var tasksResults = await Task.WhenAll(tasks);

        return new MarkTicketsResult
        {
            MarkedResults = tasksResults.SelectMany(x => x.MarkedResults),
            MarkedTickets = tasksResults.SelectMany(x => x.MarkedTickets)
        };
    }

    private async Task<MarkTicketsResult> MarkTicketsSiteDb(int siteDbGroupId, string markTransIds, int issueTypeId, byte markTypeId)
    {
        try
        {
            var markTicketsCommand = new MarkTicketsCommand
            {
                SiteDbGroupId = siteDbGroupId,
                TransIds = markTransIds,
                Status = markTypeId,
                IssueTypeId = issueTypeId,
                UserId = sessionService.UserId,
                Ip = sessionService.GetClientIp(),
                LogActionId = LogActionIdConstant.MarkTicketAddRequestTvs
            };

            var (results, transIds) = await repository.FetchMultipleAsync<Result, long>(markTicketsCommand);

            return new MarkTicketsResult
            {
                MarkedResults = results,
                MarkedTickets = transIds
            };
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync(e);
            return new MarkTicketsResult
            {
                MarkedResults = new List<Result> { new() { ErrorCode = 1, ErrorMsg = e.Message } },
                MarkedTickets = Enumerable.Empty<long>()
            };
        }
    }
}