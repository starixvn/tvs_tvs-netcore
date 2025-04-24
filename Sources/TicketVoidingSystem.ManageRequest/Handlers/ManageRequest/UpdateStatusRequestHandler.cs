using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Notification;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class UpdateStatusRequest : UpdateStatusRequestCommand, IRequest<Result>;

public class UpdateStatusRequestHandler(IDynamicRepository repository, NotificationService notificationService)
    : IRequestHandler<UpdateStatusRequest, Result>
{
    public async Task<Result> Handle(UpdateStatusRequest request, CancellationToken cancellationToken)
    {
        try
        {
            await repository.ExecuteAsync(request);
            SendNotification(request.RequestId, true);
            return new Result();
        }
        catch (Exception exception)
        {
            SendNotification(request.RequestId, false);
            return new Result
            {
                ErrorCode = 1,
                ErrorMsg = exception.Message
            };
        }
    }

    private void SendNotification(int requestId, bool isSuccessful)
    {
        var content = isSuccessful
            ? MessageHelper.CreateStoredRequestSuccessfully(requestId)
            : MessageHelper.CreateStoredRequestFailed(requestId);
        notificationService.ExecuteBackground(() => notificationService.InsertUpdateRequest(NotificationType.Notification, content, requestId));
    }
}