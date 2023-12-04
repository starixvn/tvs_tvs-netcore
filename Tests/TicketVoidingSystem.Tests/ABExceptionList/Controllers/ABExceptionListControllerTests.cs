using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using TicketVoidingSystem.ABExceptionList.Controllers;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.ABExceptionList.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ABExceptionList.Controllers;

public class ABExceptionListControllerTests
{
    [Fact]
    public async Task CheckUsernames_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new CheckUsernamesRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new ABExceptionListController(mediator);

        // Act
        await controller.CheckUsernames(request);

        // Assert
        await mediator.Received(1).Send(request);
    }

    [Fact]
    public async Task AddUsers_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new AddUsersRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new ABExceptionListController(mediator);

        // Act
        await controller.AddUsers(request);

        // Assert
        await mediator.Received(1).Send(request);
    }

    [Fact]
    public async Task RemoveUsers_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new RemoveUsersRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new ABExceptionListController(mediator);

        // Act
        await controller.RemoveUsers(request);

        // Assert
        await mediator.Received(1).Send(request);
    }

    [Fact]
    public async Task GetUsers_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetUsersRequest();
        var mediator = Substitute.For<IMediator>();
        var controller = new ABExceptionListController(mediator);

        // Act
        await controller.GetUsers(request);

        // Assert
        await mediator.Received(1).Send(request);
    }

    [Fact]
    public async Task GetPermission_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var permission = new PermissionABExceptionList();
        var mediator = Substitute.For<IMediator>();
        mediator.Send(Arg.Any<GetPermissionRequest>()).ReturnsForAnyArgs(permission);
        var controller = new ABExceptionListController(mediator);

        // Act
        await controller.GetPermission();

        // Assert
        await mediator.Received(1).Send(Arg.Any<GetPermissionRequest>());
    }

    [Fact]
    public async Task GetSubType_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var subTypes = new List<AbExceptionSubTypeViewModel>();
        var mediator = Substitute.For<IMediator>();
        mediator.Send(Arg.Any<GetSubTypeRequest>()).ReturnsForAnyArgs(subTypes);
        var controller = new ABExceptionListController(mediator);

        // Act
        await controller.GetSubType();

        // Assert
        await mediator.Received(1).Send(Arg.Any<GetSubTypeRequest>());
    }

    [Fact]
    public async Task GetSites_WhenCalled_ReturnJsonData()
    {
        // Arrange
        var models = new List<GroupLicenseeSiteViewModel> { new() { GroupName = "credit" } };
        var mediator = Substitute.For<IMediator>();
        mediator.Send(Arg.Any<GetSitesRequest>()).ReturnsForAnyArgs(models);
        var controller = new ABExceptionListController(mediator);

        // Act
        var okObjectResult = await controller.GetSites() as OkObjectResult;
        var actual = okObjectResult.Value as List<GroupLicenseeSiteViewModel>;

        // Assert
        await mediator.Received(1).Send(Arg.Any<GetSitesRequest>());
        Assert.Equal(models, actual);
    }
}