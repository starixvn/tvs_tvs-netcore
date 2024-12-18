using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.VoidSingleBet.Controllers;
using TicketVoidingSystem.VoidSingleBet.Handlers;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Controllers;

public class TicketListingControllerTests
{
    [Fact]
    public async Task GetRemark_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var controller = new VoidSingleBetController(mediator);

        // Act
        await controller.GetRemark();

        // Assert
        await mediator.Received().Send(Arg.Any<GetRemarkRequest>());
    }

    [Fact]
    public async Task GetTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var controller = new VoidSingleBetController(mediator);

        // Act
        await controller.GetTickets(new GetTicketsRequest());

        // Assert
        await mediator.Received().Send(Arg.Any<GetTicketsRequest>());
    }

    [Fact]
    public async Task GetLogInfo_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var controller = new VoidSingleBetController(mediator);

        // Act
        await controller.GetLogInfo(new GetLogInfoRequest());

        // Assert
        await mediator.Received().Send(Arg.Any<GetLogInfoRequest>());
    }

    [Fact]
    public async Task ExportExcel_HasRequest_CallMediatorRequest()
    {
        // Arrange

        var controllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        var mediator = Substitute.For<IMediator>();
        var excelFileModel = new ExcelFileModel
        {
            FileName = "AA",
            ContentAsByteArray = []
        };
        mediator.Send(Arg.Any<ExportExcelRequest>()).ReturnsForAnyArgs(excelFileModel);
        var controller = new VoidSingleBetController(mediator)
        {
            ControllerContext = controllerContext
        };
        // Act
        await controller.ExportExcel(new ExportExcelRequest());

        // Assert
        await mediator.Received().Send(Arg.Any<ExportExcelRequest>());
    }

    [Fact]
    public async Task VoidTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var controller = new VoidSingleBetController(mediator);

        // Act
        await controller.VoidTickets(new VoidTicketsRequest());

        // Assert
        await mediator.Received().Send(Arg.Any<VoidTicketsRequest>());
    }
}