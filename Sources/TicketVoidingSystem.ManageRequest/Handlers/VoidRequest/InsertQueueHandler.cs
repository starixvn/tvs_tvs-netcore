using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SignalR;

namespace TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;

public class InsertQueueRequest : InsertQueueQuery, IRequest<Result>
{
}

public class InsertQueueHandler : IRequestHandler<InsertQueueRequest, Result>
{
    private readonly IInsertQueueService insertQueueService;
    private readonly SessionService sessionService;
    private readonly LoggingService loggingService;
    private readonly NotificationSignalRService signalRService;

    public InsertQueueHandler(
        IInsertQueueService insertQueueService,
        SessionService sessionService,
        LoggingService loggingService,
        NotificationSignalRService signalRService)
    {
        this.insertQueueService = insertQueueService;
        this.sessionService = sessionService;
        this.loggingService = loggingService;
        this.signalRService = signalRService;
    }

    public async Task<Result> Handle(InsertQueueRequest request, CancellationToken cancellationToken)
    {
        Result result;
        try
        {
            result = await InsertQueue(request);
        }
        catch (Exception e)
        {
            result = new Result { ErrorCode = ErrorCode.InsertQueueException, ErrorMsg = "The request cannot void. Please contact IT team." };
            await loggingService.ErrorAsync(e);
        }
        return result;
    }

    private async Task<Result> InsertQueue(InsertQueueQuery query)
    {
        var result = new Result();
        if (sessionService.CheckPassword(query.UserPassword))
        {
            query.SingleTickets = query.SingleTickets ?? Enumerable.Empty<BetId>();
            query.ParlayTickets = query.ParlayTickets ?? Enumerable.Empty<BetId>();
            query.CricketTickets = query.CricketTickets ?? Enumerable.Empty<BetId>();
            query.CancelCashOutTickets = query.CancelCashOutTickets ?? Enumerable.Empty<BetId>();
            await insertQueueService.InsertTicketVoidingQueue(query);
            await insertQueueService.UpdateIsProcessed(query);
            UpdateRunningRequest(query.RequestId);
        }
        else
        {
            result.ErrorCode = ErrorCode.WrongPassword;
            result.ErrorMsg = "Sorry. You can not process void bet due to either wrong password or insufficient permission!";
        }

        return result;
    }

    private void UpdateRunningRequest(int requestId)
    {
        var requestStatus = new List<RequestStatus>
            {
                new RequestStatus
                {
                    RequestId = requestId,
                    Status = "Running"
                }
            };
        signalRService.UpdateRequestStatusToAllUser(requestStatus);
    }
}