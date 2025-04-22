using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using Fanex.Logging;
using TicketVoidingSystem.Criteria.Notification;
using TicketVoidingSystem.Models.Notification;
using TicketVoidingSystem.SignalR;

namespace TicketVoidingSystem.Services.Notification;

public interface NotificationService
{
    Task<IEnumerable<NotificationModel>> Get();

    void ExecuteBackground(Func<Task> action);

    Task UpdateNotification(string idList, bool isRead);

    Task InsertUpdateRequest(string type, string content, int? requestId);
}

public class NotificationServiceImp(
    IDynamicRepository repository,
    SessionService sessionService,
    NotificationSignalRService signalRService)
    : NotificationService
{
    public async Task<IEnumerable<NotificationModel>> Get()
    {
        var criteria = new GetNotificationCriteria
        {
            Username = sessionService.UserName
        };

        return await repository.FetchAsync<NotificationModel>(criteria);
    }

    public void ExecuteBackground(Func<Task> action)
    {
        _ = Task.Run(async () =>
        {
            try
            {
                await action();
            }
            catch (Exception ex)
            {
                _ = LogService.ErrorAsync($"Notification background execution error: {ex.Message}");
            }
        });
    }

    public async Task UpdateNotification(string idList, bool isRead)
    {
        var criteria = new UpdateNotificationCriteria
        {
            IdList = idList,
            Username = sessionService.UserName,
            IsRead = isRead,
        };

        _ = await repository.FetchMultipleAsync<NotificationModel, string>(criteria);
    }

    public async Task InsertUpdateRequest(string type, string content, int? requestId)
    {
        var username = sessionService.UserName;
        var criteria = new UpdateNotificationCriteria
        {
            RequestId = requestId,
            Username = sessionService.UserName,
            Content = content,
            Type = type
        };
        var (notifications, targetUsers) = await repository.FetchMultipleAsync<NotificationModel, string>(criteria);
        var preparedUsers = targetUsers.Where(x => x != username);
        var tasks = preparedUsers.Select(x => signalRService.PushNotification(x, notifications.First()));
        _ = Task.WhenAll(tasks);
    }
}