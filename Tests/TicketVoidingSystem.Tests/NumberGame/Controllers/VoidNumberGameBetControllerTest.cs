using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SpecialDelete.NumberGame.Controllers;
using SpecialDelete.NumberGame.Handlers;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.NumberGame.Controllers;

public class VoidNumberGameBetControllerTest
{
    [Fact]
    public async Task GetVoidTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetVoidTicketsRequest { MatchId = 123456 };
        var mediator = Substitute.For<IMediator>();
        var controller = new VoidNumberGameBetController(mediator);

        // Act
        await controller.GetVoidTickets(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task VoidTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new VoidTicketsRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new VoidNumberGameBetController(mediator);

        // Act
        await controller.VoidTickets(request);

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
        var controller = new VoidNumberGameBetController(mediator)
        {
            ControllerContext = controllerContext
        };
        // Act
        await controller.ExportExcel(request);

        // Assert
        await mediator.Received().Send(Arg.Any<ExportExcelRequest>());
    }
}