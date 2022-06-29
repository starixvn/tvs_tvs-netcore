using Microsoft.AspNetCore.SignalR;

namespace TicketVoidingSystem.Core.SignalR
{
    public class CustomIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            return connection.User?.Identity?.Name;
        }
    }
}