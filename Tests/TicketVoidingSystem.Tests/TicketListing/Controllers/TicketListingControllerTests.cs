using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.TicketListing.Controllers;
using TicketVoidingSystem.TicketListing.Handlers;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketListing.Controllers;

public class TicketListingControllerTests
{
    [Fact]
    public async Task GetLicensees_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var controller = new TicketListingController(mediator);

        // Act
        await controller.GetLicensees();

        // Assert
        await mediator.Received().Send(Arg.Any<GetLicenseesRequest>());
    }

    [Fact]
    public async Task GetSummaryTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetSummaryRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new TicketListingController(mediator);

        // Act
        await controller.GetSummaryTickets(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task GetTicketsDetail_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetTicketsDetailRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new TicketListingController(mediator);

        // Act
        await controller.GetTicketsDetail(request);

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
        var controller = new TicketListingController(mediator)
        {
            ControllerContext = controllerContext
        };
        // Act
        await controller.ExportExcel(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task SendDataToOic_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new SendDataToOicRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new TicketListingController(mediator);

        // Act
        await controller.SendDataToOic(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task SendCreditDataToLetsTalk_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new SendCreditDataToLetstalkRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new TicketListingController(mediator);

        // Act
        await controller.SendCreditDataToLetsTalk(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task GetSelectionTypes_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetSelectionTypesRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new TicketListingController(mediator);

        // Act
        await controller.GetSelectionTypes(request);

        // Assert
        await mediator.Received().Send(request);
    }
}