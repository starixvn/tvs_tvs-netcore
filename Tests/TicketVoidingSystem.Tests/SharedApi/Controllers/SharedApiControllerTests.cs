using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Controllers;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Controllers;

public class SharedApiControllerTests
{
    private readonly IMediator mediator;
    private readonly SharedApiController controller;

    public SharedApiControllerTests()
    {
        mediator = Substitute.For<IMediator>();
        var httpContextAccessor = Substitute.For<IHttpContextAccessor>();
        controller = new SharedApiController(mediator, httpContextAccessor);
    }

    [Fact]
    public void GetNapUserInfo_HasRequest_ReturnIActionResult()
    {
        // Arrange
        // Act
        var actual = controller.GetNapUserInfo();

        // Assert
        Assert.NotNull(actual);
    }

    [Fact]
    public async Task GetBalanceUp_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetBalanceUp();

        // Assert
        await mediator.Received(1).Send(Arg.Any<GetBalanceUpDayRequest>());
    }

    [Fact]
    public async Task GetBalanceUpZoneManila_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetBalanceUpZoneManila();

        // Assert
        await mediator.Received(1).Send(Arg.Any<GetBalanceUpDayZoneManilaRequest>());
    }

    [Fact]
    public async Task GetSportsType_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetSportsType();

        // Assert
        await mediator.Received(1).Send(Arg.Any<GetSportsTypeRequest>());
    }

    [Fact]
    public async Task GetVoidResultCache_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetVoidResultCacheRequest();

        // Act
        await controller.GetVoidResultCache(request);

        // Assert
        await mediator.Received(1).Send(request);
    }

    [Fact]
    public async Task GetIssueTypes_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetIssueTypes();

        // Assert
        await mediator.Received(1).Send(Arg.Any<GetIssueTypesRequest>());
    }

    [Fact]
    public async Task GetIssueTypePermissionList_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetIssueTypePermissionList();

        // Assert
        await mediator.Received(1).Send(Arg.Any<GetIssueTypePermissionListRequest>());
    }
}