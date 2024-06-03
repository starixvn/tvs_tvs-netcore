using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
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
            var repository = Substitute.For<IDynamicRepository>();
            var matchService = Substitute.For<MatchService>();
            var requestInfoList = new List<RequestInfoForCopy> { copyRequestInfoModel };
            var betTypeTickets = new List<BetTypeTicketsInfo> { new() };
            repository.FetchMultipleAsync<RequestInfoForCopy, BetTypeTicketsInfo>(request).ReturnsForAnyArgs((requestInfoList, betTypeTickets));
            var handler = new CopyRequestInfoHandler(repository, matchService);

            // Act
            _ = await handler.Handle(request, CancellationToken.None);

            // Assert
            await repository.Received(1).FetchMultipleAsync<RequestInfoForCopy, BetTypeTicketsInfo>(request);
            matchService.Received(1).UpdateMatchInfoFromRemotingRef(Arg.Any<Match>());
        }
    }
}