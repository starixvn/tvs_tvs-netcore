using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Controllers;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Controllers;

public class ManageRequestControllerTests
{
    private readonly ManageRequestController controller;
    private readonly IMediator mediator;

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
        // Act
        await controller.GetIssueTypeName(1);

        // Assert
        await mediator.Received().Send(Arg.Any<GetIssueNameRequest>());
    }

    [Fact]
    public async Task GetRequest_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetRequest(1);

        // Assert
        await mediator.Received().Send(Arg.Any<GetRequestRequest>());
    }

    [Fact]
    public async Task GetRequests_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetRequests(null);

        // Assert
        await mediator.Received().Send(Arg.Any<SelectRequestsRequest>());
    }

    [Fact]
    public async Task GetVoidedTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetVoidedTickets(null);

        // Assert
        await mediator.Received().Send(Arg.Any<GetVoidedTicketsRequest>());
    }

    [Fact]
    public async Task ExportRequest_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new ExportExcelRequest { RequestId = "12345" };
        var fakeModel = new ExcelFileModel { FileName = "Manage_Request_TVS_", ContentAsByteArray = new byte[10] };
        mediator.Send(request).ReturnsForAnyArgs(Task.FromResult(fakeModel));
        var httpContext = new DefaultHttpContext();

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };

        // Act
        await controller.ExportRequest(request);

        // Assert
        await mediator.Received().Send(Arg.Any<ExportExcelRequest>());
    }

    [Fact]
    public async Task ExportVoidedTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new ExportVoidedTicketsRequest { RequestId = 1 };
        var fakeModel = new ExcelFileModel { FileName = "Manage_Request_TVS_", ContentAsByteArray = new byte[10] };
        mediator.Send(request).ReturnsForAnyArgs(Task.FromResult(fakeModel));
        var httpContext = new DefaultHttpContext();

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };

        // Act
        await controller.ExportVoidedTickets(request);

        // Assert
        await mediator.Received().Send(Arg.Any<ExportVoidedTicketsRequest>());
    }

    [Fact]
    public async Task GetGeneralInfo_WhenCalled_ReturnExpectedResult()
    {
        // Arrange
        // Act
        await controller.GetGeneralInfo(null);

        // Assert
        await mediator.Received(1).Send(Arg.Any<GetGeneralInfoRequest>());
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
        // Act
        await controller.CheckBy(null);

        // Assert
        await mediator.Received().Send(Arg.Any<CheckByRequest>());
    }

    [Fact]
    public async Task CopyRequestInfo_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.CopyRequestInfo(null);

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
        // Act
        await controller.GetExcelVoidedTicketForSendLetstalk(null);

        // Assert
        await mediator.Received().Send(Arg.Any<GetExcelVoidedTicketForSendLetstalkRequest>());
    }

    [Fact]
    public async Task UpdateRequest_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.UpdateRequest(null);

        // Assert
        await mediator.Received().Send(Arg.Any<EditRequest>());
    }
}