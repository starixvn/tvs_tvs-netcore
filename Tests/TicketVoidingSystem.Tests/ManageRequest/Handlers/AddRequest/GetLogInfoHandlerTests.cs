using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Extensions;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest
{
    public class GetLogInfoHandlerTests
    {
        [Fact]
        public async Task Handle_RepositoryHasCalled_ReturnViewModelExpected()
        {
            // Arrange
            var request = new GetLogInfoRequest();
            var logInfoService = Substitute.For<LogInfoService>();
            var issueTypes = new List<IssueType> { new IssueType() };
            var subIssueTypes = new List<SubIssueType> { new SubIssueType() };
            var expected = new GetLogInfoViewModel();
            logInfoService.GetLogInfo(Arg.Any<GetLogInfoRequest>()).ReturnsForAnyArgs(expected);

            var handler = new GetLogInfoHandler(logInfoService);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            AssertExtension.Equal(expected, actual);
        }
    }
}