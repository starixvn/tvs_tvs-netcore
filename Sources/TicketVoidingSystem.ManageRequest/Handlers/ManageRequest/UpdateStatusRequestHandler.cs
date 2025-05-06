using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Notification;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class UpdateStatusRequest : UpdateStatusRequestCommand, IRequest<Result>;

public class UpdateStatusRequestHandler(IDynamicRepository repository, NotificationService notificationService, SessionService sessionService)
    : IRequestHandler<UpdateStatusRequest, Result>
{
    public async Task<Result> Handle(UpdateStatusRequest request, CancellationToken cancellationToken)
    {
        try
        {
            await repository.ExecuteAsync(request);
            SendNotification(request.RequestId, request.IsStored, true);
            return new Result();
        }
        catch (Exception exception)
        {
            SendNotification(request.RequestId, request.IsStored, false);
            return new Result
            {
                ErrorCode = 1,
                ErrorMsg = exception.Message
            };
        }
    }

    private void SendNotification(int requestId, bool iStore, bool isSuccessful)
    {
        var type = isSuccessful ? NotificationType.Notification : NotificationType.Error;
        var content = isSuccessful
            ? MessageHelper.CreateStoredRequestSuccessfully(requestId, iStore, sessionService.UserName)
            : MessageHelper.CreateStoredRequestFailed(requestId, iStore);
        var targetType = isSuccessful ? NotificationTargetType.IgnoreCurrentUser : NotificationTargetType.OnlyCurrentUser;
        notificationService.ExecuteBackground(() => notificationService.InsertNotification(type, content, targetType, requestId));
    }
}