using System;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.ManageVoidServices.Tests.Handlers;

// Jacob good
public class UpdateVoidBetAutomationHandlerTests
{
    [Fact]
    public async Task Handle_HasRequest_ReturnTrue()
    {
        // Arrange
        var request = new UpdateVoidBetAutomationInfoRequest();
        var afterVoidService = Substitute.For<AfterVoidService>();
        var handler = new UpdateVoidBetAutomationHandler(afterVoidService, null);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.True(actual);
    }

    [Fact]
    public async Task Handle_HasRequest_ReturnFalse()
    {
        // Arrange
        var request = new UpdateVoidBetAutomationInfoRequest();
        var afterVoidService = Substitute.For<AfterVoidService>();
        var loggingService = Substitute.For<LoggingService>();
        afterVoidService.When(x => x.UpdateVoidBetAutomationServiceInfo(Arg.Any<VoidBetAutomationModel>()))
            .Do(x => throw new Exception());
        var handler = new UpdateVoidBetAutomationHandler(afterVoidService, loggingService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await loggingService.Received(1).ErrorAsync(Arg.Any<string>(), Arg.Any<Exception>());
        Assert.False(actual);
    }
}