using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SignalR;

namespace TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;

public class InsertQueueRequest : InsertQueueQuery, IRequest<Result>;

public class InsertQueueHandler(
    InsertQueueService insertQueueService,
    SessionService sessionService,
    LoggingService loggingService,
    NotificationSignalRService signalRService)
    : IRequestHandler<InsertQueueRequest, Result>
{
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
            query.SingleTickets ??= [];
            query.ParlayTickets ??= [];
            query.CricketTickets ??= [];
            query.CancelCashOutTickets ??= [];
            await insertQueueService.InsertTicketVoidingQueue(query);
            await insertQueueService.UpdateIsProcessed(query);
            await UpdateRunningRequest(query.RequestId);
        }
        else
        {
            result.ErrorCode = ErrorCode.WrongPassword;
            result.ErrorMsg = "Sorry. You can not process void bet due to either wrong password or insufficient permission!";
        }

        return result;
    }

    private async Task UpdateRunningRequest(int requestId)
    {
        var requestStatus = new List<RequestStatus>
            {
                new()
                {
                    RequestId = requestId,
                    Status = "Running"
                }
            };
        await signalRService.UpdateRequestStatusToAllUser(requestStatus);
    }
}