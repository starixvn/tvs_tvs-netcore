using System.Threading.Tasks;
using MediatR;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Controllers;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using Xunit;

namespace TicketVoidingSystem.ManageVoidServices.Tests.Controllers;

public class ManageVoidServicesControllerTests
{
    [Fact]
    public async Task GetVoidBetAutomationServiceInfo_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetVoidBetAutomationInfoRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new ManageVoidServicesController(mediator);

        // Act
        await controller.GetVoidBetAutomationServiceInfo(request);

        // Assert
        await mediator.Received(1).Send(request);
    }

    [Fact]
    public async Task UpdateVoidBetAutomationServiceInfo_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new UpdateVoidBetAutomationInfoRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new ManageVoidServicesController(mediator);

        // Act
        await controller.UpdateVoidBetAutomationServiceInfo(request);

        // Assert
        await mediator.Received(1).Send(request);
    }

    [Fact]
    public async Task GetAutoVoidRequestQueue_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetAutoVoidRequestQueueRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new ManageVoidServicesController(mediator);

        // Act
        await controller.GetAutoVoidRequestQueue(request);

        // Assert
        await mediator.Received(1).Send(request);
    }

    [Fact]
    public async Task UpdateAutoVoidRequestQueue_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new UpdateAutoVoidRequestQueueRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new ManageVoidServicesController(mediator);

        // Act
        await controller.UpdateAutoVoidRequestQueue(request);

        // Assert
        await mediator.Received(1).Send(request);
    }

    [Fact]
    public async Task GetTicketVoidingQueue_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetTicketVoidingQueueRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new ManageVoidServicesController(mediator);

        // Act
        await controller.GetTicketVoidingQueue(request);

        // Assert
        await mediator.Received(1).Send(request);
    }

    [Fact]
    public async Task UpdateTicketVoidingQueue_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new UpdateTicketVoidingQueueRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new ManageVoidServicesController(mediator);

        // Act
        await controller.UpdateTicketVoidingQueue(request);

        // Assert
        await mediator.Received(1).Send(request);
    }

    [Fact]
    public async Task GetVoidingHistory_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetVoidingHistoryRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new ManageVoidServicesController(mediator);

        // Act
        await controller.GetVoidingHistory(request);

        // Assert
        await mediator.Received(1).Send(request);
    }

    [Fact]
    public async Task UpdateVoidingHistory_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new UpdateVoidingHistoryRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new ManageVoidServicesController(mediator);

        // Act
        await controller.UpdateVoidingHistory(request);

        // Assert
        await mediator.Received(1).Send(request);
    }
}