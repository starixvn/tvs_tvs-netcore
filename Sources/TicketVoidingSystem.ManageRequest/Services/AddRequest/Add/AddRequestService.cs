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
            NotifyAddRequestError(markTicketResult);
            return markTicketError;
        }

        try
        {
            return await addRequestProcessStage.Execute(query);
        }
        catch (Exception exception)
        {
            NotifyAddRequestError(markTicketResult);
            _ = loggingService.ErrorAsync(exception);
            return getUpdateResultService.CreateErrorResult(exception);
        }
    }

    private void NotifyAddRequestError(MarkTicketsResult markTicketResult)
    {
        var content = MessageHelper.CreateAddRequestFailed(markTicketResult.MarkedTickets.Count());
        notificationService.ExecuteBackground(() => notificationService.InsertNotification(NotificationType.Error, content, NotificationTargetType.IgnoreCurrentUser, null));
    }
}