using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SignalR;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.SignalR
{
    public class NotificationSignalRServiceTests
    {
        private readonly IHubContext<NotificationHub, ClientEvent> hubContext;
        private readonly NotificationSignalRServiceImp service;

        public NotificationSignalRServiceTests()
        {
            var ticketVoidingSystemHttpClientService = Substitute.For<TicketVoidingSystemHttpClientService>();
            hubContext = Substitute.For<IHubContext<NotificationHub, ClientEvent>>();
            service = new NotificationSignalRServiceImp(ticketVoidingSystemHttpClientService, hubContext);
        }

        [Fact]
        public void UpdateRequestStatusToAllUser_HasUpdateRequestStatus()
        {
            // Arrange
            var status = new List<RequestStatus>();

            // Act
            _ = service.UpdateRequestStatusToAllUser(status);

            // Assert
            hubContext.Clients.All.Received(1).updateRequestStatus(status);
        }
    }
}
