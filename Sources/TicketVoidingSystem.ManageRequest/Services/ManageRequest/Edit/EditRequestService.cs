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
            return markTicketError;
        }

        var reCalcTicketsAbnormalResults = await reCalculateTicketsService.Execute(query.AbnormalBetInfo, query.IssueTypeId, query.RemoveTransIds);
        var reCalcTicketError = getUpdateResultService.GetFirstError(reCalcTicketsAbnormalResults, nameof(ReCalculateTicketsService));
        if (reCalcTicketError != null)
        {
            return reCalcTicketError;
        }

        try
        {
            return await updateRequestProcessStage.Execute(query);
        }
        catch (Exception exception)
        {
            notificationService.ExecuteBackground(()
                => notificationService.InsertUpdateRequest(NotificationType.Notification,
                    MessageHelper.CreateEditRequestFailed(query.RequestId), null));
            _ = loggingService.ErrorAsync(exception);
            return getUpdateResultService.CreateErrorResult(exception);
        }
    }
}