using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.SignalR;

public interface NotificationSignalRService
{
    Task UpdateRequestStatusToAllUser(IEnumerable<RequestStatus> status);
}

public class NotificationSignalRServiceImp : NotificationSignalRService
{
    private readonly TicketVoidingSystemHttpClientService ticketVoidingSystemHttpClientService;
    private readonly IHubContext<NotificationHub, ClientEvent> hubContext;

    public NotificationSignalRServiceImp(TicketVoidingSystemHttpClientService ticketVoidingSystemHttpClientService, IHubContext<NotificationHub, ClientEvent> hubContext)
    {
        this.ticketVoidingSystemHttpClientService = ticketVoidingSystemHttpClientService;
        this.hubContext = hubContext;
    }

    public async Task UpdateRequestStatusToAllUser(IEnumerable<RequestStatus> status)
    {
        await ticketVoidingSystemHttpClientService.SignalRUpdateRequestStatusToAllUsers(status);
        await hubContext.Clients.All.updateRequestStatus(status);
    }
}