using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.Analytics;
using TicketVoidingSystem.SharedApi.Services.Analytics;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.Analytics
{
    public class LogChangeContentHandlerTests
    {
        [Fact]
        public async Task Handle_ValidRequest_ReturnsTrue()
        {
            // Arrange
            var functionName = "TestFunction";
            var logContent = "Test Log Content";
            var request = new LogChangeContentRequest
            {
                FunctionName = functionName,
                LogContent = logContent
            };

            var userActionLogService = Substitute.For<UserActionLogService>();
            userActionLogService.LogChangeContent(functionName, logContent).Returns(true);

            var handler = new LogChangeContentHandler(userActionLogService);

            // Act
            var result = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.True(result);
        }
    }
}