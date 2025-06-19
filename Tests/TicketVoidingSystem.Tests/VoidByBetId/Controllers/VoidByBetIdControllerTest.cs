using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SpecialDelete.VoidByBetId.Controllers;
using SpecialDelete.VoidByBetId.Handlers;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Controllers;

[Category("VoidByBetId")]
public class VoidByBetIdControllerTest
{
    [Fact]
    public async Task GetTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetTicketsRequest { TransIds = "123456" };
        var mediator = Substitute.For<IMediator>();
        var controller = new VoidByBetIdController(mediator);

        // Act
        await controller.GetTickets(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task VoidBet_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var request = new VoidTicketsRequest { Tickets = tickets };
        var mediator = Substitute.For<IMediator>();
        var controller = new VoidByBetIdController(mediator);

        // Act
        await controller.VoidBet(request);

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
            FileName = "Void_By_Bet_ID_2017_07_27_10_10_10",
            ContentAsByteArray = []
        };
        var request = new ExportExcelRequest();
        var mediator = Substitute.For<IMediator>();
        mediator.Send(request).ReturnsForAnyArgs(excelFileModel);
        var controller = new VoidByBetIdController(mediator)
        {
            ControllerContext = controllerContext
        };

        // Act
        await controller.ExportExcel(request);

        // Assert
        await mediator.Received().Send(request);
    }
}