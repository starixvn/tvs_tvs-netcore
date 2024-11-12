using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Controllers;
using SpecialDelete.VoidByCurrency.Handlers;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Controllers;

public class VoidByCurrencyControllerTest
{
    [Fact]
    public async Task GetFilterModel_HasRequest_SendRequestByMediator()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var controller = new VoidByCurrencyController(mediator);

        // Act
        // Assert
        await controller.GetFilterModel();
    }

    [Fact]
    public async Task GetTickets_HasRequest_SendRequestByMediator()
    {
        // Arrange
        var request = new GetTicketsRequest { MatchId = 132 };
        var mediator = Substitute.For<IMediator>();
        var controller = new VoidByCurrencyController(mediator);

        // Act
        await controller.GetTickets(request);

        // Assert
        await mediator.Received().Send(Arg.Is<GetTicketsRequest>(x => x.MatchId == request.MatchId));
    }

    [Fact]
    public async Task VoidTickets_HasRequest_SendRequestByMediator()
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
        var controller = new VoidByCurrencyController(mediator);

        // Act
        await controller.VoidTickets(request);

        // Assert
        await mediator.Received().Send(Arg.Is<VoidTicketsRequest>(x => x.Tickets.Count() == request.Tickets.Count()));
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
        var request = new ExportExcelRequest { MatchId = 123465 };
        var controller = new VoidByCurrencyController(mediator)
        {
            ControllerContext = controllerContext
        };
        // Act
        await controller.ExportExcel(request);

        // Assert
        await mediator.Received().Send(request);
    }
}