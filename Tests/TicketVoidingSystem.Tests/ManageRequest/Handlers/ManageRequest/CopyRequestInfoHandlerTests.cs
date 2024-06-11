using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using Xunit;
using Substitute = NSubstitute.Substitute;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest
{
    public class CopyRequestInfoHandlerTests
    {
        [Fact]
        public async Task Handler_ServiceExecute_ReturnExactModel()
        {
            // Arrange
            var copyRequestInfoModel = new RequestInfoForCopy
            {
                GlobalShowTime = DateTimeOffset.Now.DateTime,
                MatchId = 123,
                RequestId = "456",
                IssueTypeName = "IssueTypeName",
                SubIssueTypeName = "SubIssueTypeName",
                Provider = "Provider",
            };
            var request = new CopyRequestInfoRequest { RequestId = 123, MatchId = 1 };
            var copyRequestInfoService = Substitute.For<CopyRequestInfoService>();
            var betTypeTickets = new List<BetTypeTicketsInfo> { new() };
            copyRequestInfoService.GetCopyInfo(request.MatchId, request.RequestId).ReturnsForAnyArgs((copyRequestInfoModel, betTypeTickets));
            var handler = new CopyRequestInfoHandler(copyRequestInfoService);

            // Act
            _ = await handler.Handle(request, CancellationToken.None);

            // Assert
            await copyRequestInfoService.Received(1).GetCopyInfo(request.MatchId, request.RequestId);
            copyRequestInfoService.Received(1).UpdateMatchInfo(Arg.Any<int>(), Arg.Any<RequestInfoForCopy>());
        }
    }
}