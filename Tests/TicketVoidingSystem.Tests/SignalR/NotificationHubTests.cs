using System.Collections.Generic;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SignalR;
using Xunit;

namespace TicketVoidingSystem.Tests.SignalR
{
    public class NotificationHubTests
    {
        [Fact]
        public void ClientEvent_Successful_CalledMethod()
        {
            // Arrange
            var results = new List<Result>
            {
                new() { ErrorCode = 0, ErrorMsg = "" }
            };
            var simpleInfo = new RequestSimpleInfo { MatchId = 1, TotalVoidedParlay = 1, TotalVoidedSingle = 1, LastPerformedBy = "" };
            var requestStatus = new List<RequestStatus>
            {
                new()
                {
                    RequestId = 1,
                    Status = "",
                    SimpleInfo = simpleInfo
                }
            };
            var clientEvent = Substitute.For<ClientEvent>();
            clientEvent.showVoidResult(results);
            clientEvent.updateRequestStatus(requestStatus);
            clientEvent.showErrorMessage("");

            clientEvent.Received(1).showVoidResult(results);
            clientEvent.Received(1).updateRequestStatus(requestStatus);
            clientEvent.Received(1).showErrorMessage("");
        }
    }
}