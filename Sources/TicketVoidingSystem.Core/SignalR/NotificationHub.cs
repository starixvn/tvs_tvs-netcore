using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using TicketVoidingSystem.Core.Models;

namespace TicketVoidingSystem.Core.SignalR
{
    public class NotificationHub : Hub<ClientEvent>
    {
        public void ShowVoidResultToAllClient(IEnumerable<Result> results)
        {
            Clients.All.showVoidResult(results);
        }

        public void UpdateRequestStatusToAllClient(IEnumerable<RequestStatus> status)
        {
            Clients.All.updateRequestStatus(status);
        }
    }

    public interface ClientEvent
    {
        void showVoidResult(IEnumerable<Result> results);

        void updateRequestStatus(IEnumerable<RequestStatus> status);

        void showErrorMessage(string message);
    }
}