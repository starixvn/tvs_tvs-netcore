using System.Threading.Tasks;
using MediatR;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Controllers;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Controllers;

public class ManageRequestControllerTests
{
    private readonly IMediator mediator;
    private readonly ManageRequestController controller;

    public ManageRequestControllerTests()
    {
        mediator = Substitute.For<IMediator>();
        controller = new ManageRequestController(mediator);
    }

    [Fact]
    public async Task GetVoidActions_HasRequest_CallMediatorRequest()
    {
        // Arrange

        // Act
        await controller.GetVoidActions();

        // Assert
        await mediator.Received().Send(Arg.Any<GetVoidActionsRequest>());
    }

    [Fact]
    public async Task GetIssueTypeName_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = 1;

        // Act
        await controller.GetIssueTypeName(request);

        // Assert
        await mediator.Received().Send(Arg.Any<GetIssueNameRequest>());
    }

    [Fact]
    public async Task GetRequest_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = 1;

        // Act
        await controller.GetRequest(request);

        // Assert
        await mediator.Received().Send(Arg.Any<GetRequestRequest>());
    }

    [Fact]
    public async Task GetRequests_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new SelectRequestsRequest();

        // Act
        await controller.GetRequests(request);

        // Assert
        await mediator.Received().Send(Arg.Any<SelectRequestsRequest>());
    }

    // [Fact]
    // public async Task ExportRequest_HasRequest_CallMediatorRequest()
    // {
    //     // Arrange
    //     var request = new ExportExcelRequest { RequestId = "12345" };
    //     var fakeModel = new ExcelFileModel { FileName = "Manage_Request_TVS_" };
    //     var fakeRespone = Task.FromResult(fakeModel);
    //     mediator.Send(request).ReturnsForAnyArgs(fakeRespone);

    //     // Act
    //     await controller.ExportRequest(request);

    //     // Assert
    //     await mediator.Received().Send(Arg.Any<ExportExcelRequest>());
    // }

    [Fact]
    public async Task GetGeneralInfo_WhenCalled_ReturnExpectedResult()
    {
        // Arrange
        var models = new GeneralInfoViewModel();
        var request = new GetGeneralInfoRequest { RequestId = 123 };
        mediator.Send(Arg.Compat.Any<GetGeneralInfoRequest>()).ReturnsForAnyArgs(models);

        // Act
        await controller.GetGeneralInfo(request);

        // Assert
        await mediator.Received().Send(Arg.Any<GetGeneralInfoRequest>());
    }

    [Fact]
    public async Task GetMarkedTicketsCount_HasRequest_CallMediatorRequest()
    {
        // Arrange

        // Act
        await controller.GetMarkedTicketsCount();

        // Assert
        await mediator.Received().Send(Arg.Any<GetMarkedTicketsCountRequest>());
    }

    [Fact]
    public async Task CheckBy_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new CheckByRequest();

        // Act
        await controller.CheckBy(request);

        // Assert
        await mediator.Received().Send(Arg.Any<CheckByRequest>());
    }

    [Fact]
    public async Task CopyRequestInfo_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new CopyRequestInfoRequest();

        // Act
        await controller.CopyRequestInfo(request);

        // Assert
        await mediator.Received().Send(Arg.Any<CopyRequestInfoRequest>());
    }

    [Fact]
    public async Task GetPermissionManage_HasRequest_CallMediatorRequest()
    {
        // Arrange

        // Act
        await controller.GetPermissionManage();

        // Assert
        await mediator.Received().Send(Arg.Any<GetPermissionManageRequest>());
    }

    [Fact]
    public async Task GetExcelVoidedTicketForSendLetstalk_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetExcelVoidedTicketForSendLetstalkRequest();

        // Act
        await controller.GetExcelVoidedTicketForSendLetstalk(request);

        // Assert
        await mediator.Received().Send(Arg.Any<GetExcelVoidedTicketForSendLetstalkRequest>());
    }

}