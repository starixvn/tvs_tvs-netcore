using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Controllers;
using TicketVoidingSystem.SharedApi.Handlers.Analytics;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Controllers
{
    public class AnalyticsControllerTests
    {
        [Fact]
        public async Task LogAccessFunction_HasRequest_CallMediatorSend()
        {
            // Arrange
            var request = new LogAccessFunctionRequest();
            var mediator = Substitute.For<IMediator>();
            var controller = new AnalyticsController(mediator);

            // Act
            var result = await controller.LogAccessFunction(request) as OkObjectResult;

            // Assert
            await mediator.Received(1).Send(request);
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task LogChangeContent_HasRequest_CallMediatorSend()
        {
            // Arrange
            var request = new LogChangeContentRequest();
            var mediator = Substitute.For<IMediator>();
            var controller = new AnalyticsController(mediator);

            // Act
            var result = await controller.LogChangeContent(request) as OkObjectResult;

            // Assert
            await mediator.Received(1).Send(request);
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }
    }
}