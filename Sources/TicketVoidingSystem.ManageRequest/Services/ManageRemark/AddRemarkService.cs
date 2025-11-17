using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Notification;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRemark;

public interface AddRemarkService
{
    Task<Result> Execute(AddRemarkQuery query);
}

public class AddRemarkServiceImp(IMapper mapper, SessionService sessionService, IDynamicRepository repository,
NotificationService notificationService, LoggingService loggingService)
    : AddRemarkService
{
    public async Task<Result> Execute(AddRemarkQuery query)
    {
        try
        {
            var remarkId = await ExecuteAddRemark(query);
            return new Result
            {
                ErrorCode = 0,
                ErrorMsg = "Success",
                Data = new AddRemarkResultData { MatchId = query.MatchId, RemarkId = remarkId }
            };
        }
        catch (Exception exception)
        {
            NotifyAddRemarkError();
            _ = loggingService.ErrorAsync(exception);
            return new Result { ErrorCode = 1, ErrorMsg = exception.Message };
        }
    }

    private async Task<int> ExecuteAddRemark(AddRemarkQuery query)
    {
        var command = mapper.Map<AddRemarkCommand>(query);
        command.UserId = sessionService.UserId;
        command.IP = sessionService.GetClientIp();

        return await repository.ExecuteAsync(command);
    }

    private void NotifyAddRemarkError()
    {
        var content = MessageHelper.CreateAddRemarkFailed();
        notificationService.ExecuteBackground(() => notificationService.InsertNotification(NotificationType.Error, content, NotificationTargetType.IgnoreCurrentUser, null));
    }
}