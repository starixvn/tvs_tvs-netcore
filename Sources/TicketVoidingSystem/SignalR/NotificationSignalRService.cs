using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.SignalR;

public interface NotificationSignalRService
{
    Task UpdateRequestStatusToAllUser(IEnumerable<RequestStatus> status);
}

public class NotificationSignalRServiceImp : NotificationSignalRService
{
    private readonly IHubContext<NotificationHub, ClientEvent> hubContext;

    public NotificationSignalRServiceImp(IHubContext<NotificationHub, ClientEvent> hubContext)
    {
        this.hubContext = hubContext;
    }

    public async Task UpdateRequestStatusToAllUser(IEnumerable<RequestStatus> status)
    {
        await hubContext.Clients.All.updateRequestStatus(status);
    }
}