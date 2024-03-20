using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SpecialDelete.VirtualSports.VoidParlaySub.Controllers;
using SpecialDelete.VirtualSports.VoidParlaySub.Handlers;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.VoidParlaySub.Controllers;

public class VoidParlaySubBetControllerTest
{
    [Fact]
    public async Task GetTickets_HasRequest_SendRequestByMediator()
    {
        // Arrange
        var request = new GetTicketsRequest { MatchId = 132 };
        var mediator = Substitute.For<IMediator>();
        var controller = new VoidParlaySubBetController(mediator);

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
        var controller = new VoidParlaySubBetController(mediator);

        // Act
        await controller.VoidTickets(request);

        // Assert
        await mediator.Received()
            .Send(Arg.Is<VoidTicketsRequest>(x => x.Tickets.Count() == request.Tickets.Count()));
    }

    [Fact]
    public async Task ExportExcel_Always_CallMediatorRequest()
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
            ContentAsByteArray = new byte[] { }
        };
        mediator.Send(Arg.Any<ExportExcelRequest>()).ReturnsForAnyArgs(excelFileModel);
        var response = Task.FromResult(excelFileModel);
        var request = new ExportExcelRequest { MatchId = 123465 };
        mediator.Send(request).ReturnsForAnyArgs(response);
        var controller = new VoidParlaySubBetController(mediator)
        {
            ControllerContext = controllerContext
        };
        // Act
        await controller.ExportExcel(request);

        // Assert
        await mediator.Received().Send(Arg.Any<ExportExcelRequest>());
    }
}