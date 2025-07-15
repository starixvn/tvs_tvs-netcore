using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.Analytics;
using TicketVoidingSystem.SharedApi.Services.Analytics;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.Analytics;

public class LogChangeContentHandlerTests
{
    [Fact]
    public async Task Handle_ValidRequest_ReturnsTrue()
    {
        // Arrange
        const string functionName = "TestFunction";
        const string logContent = "Test Log Content";
        var request = new LogChangeContentRequest
        {
            FunctionName = functionName,
            LogContent = logContent
        };

        var userActionLogService = Substitute.For<UserActionLogService>();

        var handler = new LogChangeContentHandler(userActionLogService);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        userActionLogService.Received(1).LogChangeContent(Arg.Any<string>(), Arg.Any<string>());
    }
}