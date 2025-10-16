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
            await HandleErrorEditRequest(query);
            return markTicketError;
        }

        var reCalcTicketsAbnormalResults = await reCalculateTicketsService.Execute(query.AbnormalBetInfo, query.IssueTypeId, query.RemoveTransIds);
        var reCalcTicketError = getUpdateResultService.GetFirstError(reCalcTicketsAbnormalResults, nameof(ReCalculateTicketsService));
        if (reCalcTicketError != null)
        {
            await HandleErrorEditRequest(query);
            return reCalcTicketError;
        }

        try
        {
            return await updateRequestProcessStage.Execute(query);
        }
        catch (Exception exception)
        {
            await HandleErrorEditRequest(query);
            _ = loggingService.ErrorAsync(exception);
            return getUpdateResultService.CreateErrorResult(exception);
        }
    }

    private async Task HandleErrorEditRequest(EditRequestQuery query)
    {
        var result = await marketTicketsWhenEditService.GetStateMarkTickets(query);
        await marketTicketsWhenEditService.Execute(query.IssueTypeId, result.MarkTransIds, result.UnMarkTransIds);

        var content = MessageHelper.CreateEditRequestFailed(query.RequestId, query.MarkTransIds?.Split(",").Length);
        notificationService.ExecuteBackground(() => notificationService.InsertNotification(NotificationType.Error, content, NotificationTargetType.IgnoreCurrentUser, query.RequestId));
    }
}