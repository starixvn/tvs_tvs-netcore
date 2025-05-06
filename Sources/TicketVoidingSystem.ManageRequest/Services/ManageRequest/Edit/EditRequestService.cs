using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Notification;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;

public interface EditRequestService
{
    Task<Result> UpdateRequest(EditRequestQuery query);
}

public class EditRequestServiceImp(
    MarkTicketsWhenAddEditService marketTicketsWhenEditService,
    ReCalculateTicketsService reCalculateTicketsService,
    UpdateRequestProcessStage updateRequestProcessStage,
    GetUpdateResultService getUpdateResultService,
    LoggingService loggingService,
    NotificationService notificationService)
    : EditRequestService
{
    public async Task<Result> UpdateRequest(EditRequestQuery query)
    {
        var markTicketResult = await marketTicketsWhenEditService.Execute(query.IssueTypeId, query.MarkTransIds, query.UnMarkTransIds);
        var markTicketError = getUpdateResultService.GetFirstError(markTicketResult.MarkedResults, nameof(MarkTicketsWhenAddEditService));
        if (markTicketError != null)
        {
            NotifyEditRequestError(query.RequestId, markTicketResult);
            return markTicketError;
        }

        var reCalcTicketsAbnormalResults = await reCalculateTicketsService.Execute(query.AbnormalBetInfo, query.IssueTypeId, query.RemoveTransIds);
        var reCalcTicketError = getUpdateResultService.GetFirstError(reCalcTicketsAbnormalResults, nameof(ReCalculateTicketsService));
        if (reCalcTicketError != null)
        {
            NotifyEditRequestError(query.RequestId, markTicketResult);
            return reCalcTicketError;
        }

        try
        {
            return await updateRequestProcessStage.Execute(query);
        }
        catch (Exception exception)
        {
            NotifyEditRequestError(query.RequestId, markTicketResult);
            _ = loggingService.ErrorAsync(exception);
            return getUpdateResultService.CreateErrorResult(exception);
        }
    }

    private void NotifyEditRequestError(int requestId, MarkTicketsResult markTicketResult)
    {
        var content = MessageHelper.CreateEditRequestFailed(requestId, markTicketResult.MarkedTickets.Count());
        notificationService.ExecuteBackground(() => notificationService.InsertNotification(NotificationType.Error, content, NotificationTargetType.IgnoreCurrentUser, requestId));
    }
}