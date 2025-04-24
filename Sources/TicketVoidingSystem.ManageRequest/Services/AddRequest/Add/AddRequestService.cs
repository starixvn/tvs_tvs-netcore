using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Notification;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface AddRequestService
{
    Task<Result> Execute(AddRequestQuery query);
}

public class AddRequestServiceImp(
    AddRequestProcessStage addRequestProcessStage,
    MarkTicketsWhenAddEditService marketTicketsWhenEditService,
    GetUpdateResultService getUpdateResultService,
    LoggingService loggingService,
    NotificationService notificationService)
    : AddRequestService
{
    public async Task<Result> Execute(AddRequestQuery query)
    {
        var markTicketResult = await marketTicketsWhenEditService.Execute(query.IssueTypeId, query.MarkTransIds, query.UnMarkTransIds);
        var markTicketError = getUpdateResultService.GetFirstError(markTicketResult.MarkedResults, nameof(MarkTicketsWhenAddEditService));
        if (markTicketError != null)
        {
            return markTicketError;
        }

        try
        {
            return await addRequestProcessStage.Execute(query);
        }
        catch (Exception exception)
        {
            notificationService.ExecuteBackground(()
                => notificationService.InsertUpdateRequest(NotificationType.Notification, MessageHelper.CreateAddRequestFailed(), null));
            _ = loggingService.ErrorAsync(exception);
            return getUpdateResultService.CreateErrorResult(exception);
        }
    }
}