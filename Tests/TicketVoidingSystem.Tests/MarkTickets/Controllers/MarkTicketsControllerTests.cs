using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Controllers;
using TicketVoidingSystem.MarkTickets.Handlers;
using TicketVoidingSystem.MarkTickets.Handlers.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Handlers.UserLogs;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.MarkTickets.Controllers;

public class MarkTicketsControllerTests
{
    [Fact]
    public async Task GetTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetTicketsRequest { MatchId = 123456 };
        var mediator = Substitute.For<IMediator>();
        var controller = new MarkTicketsController(mediator);

        // Act
        await controller.GetTickets(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task GetDetailTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetDetailTicketsRequest { MatchId = 123456 };
        var mediator = Substitute.For<IMediator>();
        var controller = new MarkTicketsController(mediator);

        // Act
        await controller.GetDetailTickets(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task GetAllMarkedTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new AllMarkedTicketsRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new MarkTicketsController(mediator);

        // Act
        await controller.GetAllMarkedTickets(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task ExportExcel_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var controllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        var excelFileModel = new ExcelFileModel
        {
            FileName = "AA",
            ContentAsByteArray = new byte[] { }
        };
        var request = new ExportExcelRequest();
        var mediator = Substitute.For<IMediator>();
        mediator.Send(Arg.Any<ExportExcelRequest>()).ReturnsForAnyArgs(excelFileModel);
        var controller = new MarkTicketsController(mediator)
        {
            ControllerContext = controllerContext
        };
        // Act
        await controller.ExportExcel(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task ExportExcelDetailTicket_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var controllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        var excelFileModel = new ExcelFileModel
        {
            FileName = "AA",
            ContentAsByteArray = new byte[] { }
        };
        var request = new ExportExcelDetailTicketsRequest();
        var mediator = Substitute.For<IMediator>();
        mediator.Send(Arg.Any<ExportExcelDetailTicketsRequest>()).ReturnsForAnyArgs(excelFileModel);
        var controller = new MarkTicketsController(mediator)
        {
            ControllerContext = controllerContext
        };

        // Act
        await controller.ExportExcelDetailTicket(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task MarkTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new MarkTicketsRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new MarkTicketsController(mediator);

        // Act
        await controller.MarkTickets(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task MarkAllTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new MarkAllTicketsRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new MarkTicketsController(mediator);

        // Act
        await controller.MarkAllTickets(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task GetUserLogs_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetUserLogsRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new MarkTicketsController(mediator);

        // Act
        await controller.GetUserLogs(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task GetDataForConfirmAutoUnmark_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetDataForConfirmAutoUnmarkRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new MarkTicketsController(mediator);

        // Act
        await controller.GetDataForConfirmAutoUnmark(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task UpdateConfirmAutoUnmark_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new UpdateConfirmAutoUnmarkRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new MarkTicketsController(mediator);

        // Act
        await controller.UpdateConfirmAutoUnmark(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task GetDataPermission_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var controller = new MarkTicketsController(mediator);

        // Act
        await controller.GetDataPermission();

        // Assert
        await mediator.Received().Send(Arg.Any<GetDataPermissionRequest>());
    }
}