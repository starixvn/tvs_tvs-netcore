using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.OnlineServerRepository;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface MarkTicketsService
{
    Task<MarkTicketsResult> MarkTicketsInTVS(string markTransIds, int issueTypeId, byte markTypeId);
}

public class MarkTicketsServiceImp(
    OnlineServerRepository onlineServerRepository,
    SessionService sessionService,
    LoggingService loggingService)
    : MarkTicketsService
{
    public async Task<MarkTicketsResult> MarkTicketsInTVS(string markTransIds, int issueTypeId, byte markTypeId)
    {
        var criteria = CreateCriteria(markTransIds, issueTypeId, markTypeId);
        var results = await onlineServerRepository.FetchMultipleAsync<Result, long>(criteria, ExecutionMode.ContinueOnError);

        return new MarkTicketsResult
        {
            MarkedResults = results.Item1,
            MarkedTickets = results.Item2
        };
    }

    private MarkTicketsCommand CreateCriteria(string markTransIds, int issueTypeId, byte markTypeId)
    {
        return new MarkTicketsCommand
        {
            TransIds = markTransIds,
            Status = markTypeId,
            IssueTypeId = issueTypeId,
            UserId = sessionService.UserId,
            Ip = sessionService.GetClientIp(),
            LogActionId = markTypeId is MarkTypeConstant.ExecuteMarkTickets
                ? LogActionIdConstant.MarkTicketAddRequestTvs
                : LogActionIdConstant.UnMarkTicketAddRequestTvs
        };
    }
}