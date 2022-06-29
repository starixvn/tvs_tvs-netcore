using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using TicketVoidingSystem.Core.Models;

namespace TicketVoidingSystem.Core.SignalR
{
    public class NotificationHub : Hub<ClientEvent>
    {
        public async Task ShowVoidResultToAllClient(IEnumerable<Result> results)
        {
            await Clients.All.showVoidResult(results);
        }

        public async Task UpdateRequestStatusToAllClient(IEnumerable<RequestStatus> status)
        {
            await Clients.All.updateRequestStatus(status);
        }
    }

    public interface ClientEvent
    {
        Task showVoidResult(IEnumerable<Result> results);

        Task updateRequestStatus(IEnumerable<RequestStatus> status);

        Task showErrorMessage(string message);
    }
}