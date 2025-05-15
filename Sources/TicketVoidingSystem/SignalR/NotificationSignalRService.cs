using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.Notification;

namespace TicketVoidingSystem.SignalR;

public interface NotificationSignalRService
{
    Task UpdateRequestStatusToAllUser(IEnumerable<RequestStatus> status);

    Task PushNotification(string userName, NotificationModel notification);
}

public class NotificationSignalRServiceImp(IHubContext<NotificationHub, ClientEvent> hubContext)
    : NotificationSignalRService
{
    public async Task UpdateRequestStatusToAllUser(IEnumerable<RequestStatus> status)
    {
        await hubContext.Clients.All.updateRequestStatus(status);
    }

    public async Task PushNotification(string userName, NotificationModel notification)
    {
        await hubContext.Clients.User(userName).pushNotification(notification);
    }
}