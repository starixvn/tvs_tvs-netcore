using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.Analytics;
using TicketVoidingSystem.SharedApi.Services.Analytics;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.Analytics
{
    public class LogAccessFunctionHandlerTests
    {
        [Fact]
        public async Task Handle_ValidRequest_ReturnsTrue()
        {
            // Arrange
            var functionName = "TestFunction";
            var request = new LogAccessFunctionRequest { FunctionName = functionName };
            var userActionLogService = Substitute.For<UserActionLogService>();
            userActionLogService.LogAccessFunction(functionName).Returns(true);
            var handler = new LogAccessFunctionHandler(userActionLogService);

            // Act
            var result = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task Handle_ValidRequest_CallsLogAccessFunction()
        {
            // Arrange
            var functionName = "TestFunction";
            var request = new LogAccessFunctionRequest { FunctionName = functionName };
            var userActionLogService = Substitute.For<UserActionLogService>();
            var handler = new LogAccessFunctionHandler(userActionLogService);

            // Act
            await handler.Handle(request, CancellationToken.None);

            // Assert
            await userActionLogService.Received(1).LogAccessFunction(functionName);
        }
    }
}