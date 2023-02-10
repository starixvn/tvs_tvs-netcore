using MediatR;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Controllers;
using TicketVoidingSystem.MarkTickets.Handlers;
using TicketVoidingSystem.MarkTickets.Handlers.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Handlers.UserLogs;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Controllers;

public class MarkTicketsControllerTests
{
    //[Fact]
    //public async Task GetIndex_HasUserNameFromMediator_ReturnViewBagWithUserName()
    //{
    //    // Arrange
    //    var fakeIndexViewModel = new IndexViewModel { UserName = "Test" };
    //    var fakeResponse = Task.FromResult(fakeIndexViewModel);

    //    var mediator = Substitute.For<IMediator>();
    //    mediator.Send(Arg.Compat.Any<IndexRequest>()).ReturnsForAnyArgs(fakeResponse);
    //    var controller = new MarkTicketsController(mediator);
    //    controller.Url = Substitute.ForPartsOf<UrlHelper>();
    //    controller.Url.Content(Arg.Compat.Any<string>()).ReturnsForAnyArgs("~");

    //    // Act
    //    var view = await controller.Index() as ViewResult;
    //    var model = (IndexViewModel)view.Model;

    //    // Assert
    //    Assert.AreEqual(fakeIndexViewModel.UserName, model.UserName);
    //}

    //[Fact]
    //public async Task GetIndex_Successful_ReturnPathFileIndex()
    //{
    //    // Arrange
    //    const string path = "~/dist/mark-tickets/index.cshtml";
    //    var fakeIndexViewModel = new IndexViewModel { UserName = "Test" };
    //    var fakeResponse = Task.FromResult(fakeIndexViewModel);

    //    var mediator = Substitute.For<IMediator>();
    //    mediator.Send(Arg.Compat.Any<IndexRequest>()).ReturnsForAnyArgs(fakeResponse);
    //    var controller = new MarkTicketsController(mediator);
    //    controller.Url = Substitute.ForPartsOf<UrlHelper>();
    //    controller.Url.Content(Arg.Compat.Any<string>()).ReturnsForAnyArgs("~");

    //    // Act
    //    var view = await controller.Index() as ViewResult;

    //    // Assert
    //    Assert.AreEqual(path, view.ViewName);
    //}

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

    //[Fact]
    //public async Task ExportExcel_HasRequest_CallMediatorRequest()
    //{
    //    // Arrange
    //    var excelFileModel = new ExcelFileModel { FileName = "123465_Mark_Unmark_Tickets_" };
    //    var response = Task.FromResult(excelFileModel);
    //    var request = new ExportExcelRequest { MatchId = 123465 };
    //    var mediator = Substitute.For<IMediator>();
    //    mediator.Send(request).ReturnsForAnyArgs(response);
    //    var controller = new MarkTicketsController(mediator);

    //    // Act
    //    await controller.ExportExcel(request);

    //    // Assert
    //    await mediator.Received().Send(request);
    //}

    //[Fact]
    //public async Task ExportExcelDetailTicket_HasRequest_CallMediatorRequest()
    //{
    //    // Arrange
    //    var context = new ControllerContext();
    //    context.HttpContext = new DefaultHttpContext();
    //    var excelFileModel = new ExcelFileModel { FileName = "123465_Mark_Unmark_Tickets_" };
    //    var reponse = Task.FromResult(excelFileModel);
    //    var request = new ExportExcelDetailTicketsRequest { MatchId = 123465 };
    //    var mediator = Substitute.For<IMediator>();
    //    mediator.Send(request).ReturnsForAnyArgs(reponse);
    //    var controller = new MarkTicketsController(mediator);

    //    // Act
    //    await controller.ExportExcelDetailTicket(request);

    //    // Assert
    //    await mediator.Received().Send(request);
    //}

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

    [Fact]
    public async Task GetLicensees_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var controller = new MarkTicketsController(mediator);

        // Act
        await controller.GetLicensees();

        // Assert
        await mediator.Received().Send(Arg.Any<GetLicenseesRequest>());
    }

    [Fact]
    public async Task GetCurrencies_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var controller = new MarkTicketsController(mediator);

        // Act
        await controller.GetCurrencies();

        // Assert
        await mediator.Received().Send(Arg.Any<GetCurrenciesRequest>());
    }
}