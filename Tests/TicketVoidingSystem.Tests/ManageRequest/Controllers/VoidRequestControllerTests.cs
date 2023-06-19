using System.Threading.Tasks;
using MediatR;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Controllers;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Controller;

public class VoidRequestControllerTests
{
    private readonly IMediator mediator;
    private readonly VoidRequestController controller;

    public VoidRequestControllerTests()
    {
        mediator = Substitute.For<IMediator>();
        controller = new VoidRequestController(mediator);
    }

    [Fact]
    public async Task GetRemark_HasRequest_CallMediatorRequest()
    {
        // Arrange

        // Act
        await controller.GetRemark();

        // Assert
        await mediator.Received().Send(Arg.Any<GetRemarkRequest>());
    }

    [Fact]
    public async Task GetLastModifiedDate_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetLastModifiedDateRequest();

        // Act
        await controller.GetLastModifiedDate(request);

        // Assert
        await mediator.Received().Send(Arg.Any<GetLastModifiedDateRequest>());
    }

    [Fact]
    public async Task GetVoidedReason_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetReasonNameRequest();

        // Act
        await controller.GetVoidedReason(request);

        // Assert
        await mediator.Received().Send(Arg.Any<GetReasonNameRequest>());
    }

    [Fact]
    public async Task GetTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetTicketsRequest();

        // Act
        await controller.GetTickets(request);

        // Assert
        await mediator.Received().Send(Arg.Any<GetTicketsRequest>());
    }

    [Fact]
    public async Task GetTicketsMini_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetTicketsMiniRequest();

        // Act
        await controller.GetTicketsMini(request);

        // Assert
        await mediator.Received().Send(Arg.Any<GetTicketsMiniRequest>());
    }

    // [Fact]
    // public async Task ExportExcel_HasRequest_CallMediatorRequest()
    // {
    //     // Arrange
    //     var model = new ExcelFileModel { FileName = "123" };

    //     var request = new TicketVoidingSystem.ManageRequest.Handlers.VoidRequest.ExportExcelRequest { RequestId = 123 };
    //     mediator.Send(new TicketVoidingSystem.ManageRequest.Handlers.VoidRequest.ExportExcelRequest()).ReturnsForAnyArgs(model);
    //     // Act
    //     await controller.ExportExcel(request);

    //     // Assert
    //     await mediator.Received().Send(Arg.Any<TicketVoidingSystem.ManageRequest.Handlers.VoidRequest.ExportExcelRequest>());
    // }

    [Fact]
    public async Task InsertQueue_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new InsertQueueRequest();

        // Act
        await controller.InsertQueue(request);

        // Assert
        await mediator.Received().Send(Arg.Any<InsertQueueRequest>());
    }
}