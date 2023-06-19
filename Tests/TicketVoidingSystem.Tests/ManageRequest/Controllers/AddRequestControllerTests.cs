using System.Threading.Tasks;
using MediatR;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Controllers;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Controller;

public class AddRequestControllerTests
{
    private readonly IMediator mediator;
    private readonly AddRequestController controller;

    public AddRequestControllerTests()
    {
        mediator = Substitute.For<IMediator>();
        controller = new AddRequestController(mediator);
    }

    [Fact]
    public async Task GetIssueTypes_HasRequest_CallMediatorRequest()
    {
        // Arrange

        // Act
        await controller.GetIssueTypes();

        // Assert
        await mediator.Received().Send(Arg.Any<GetIssueTypesRequest>());
    }

    [Fact]
    public async Task GetLogInfo_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetLogInfoRequest();
        
        // Act
        await controller.GetLogInfo(request);

        // Assert
        await mediator.Received().Send(Arg.Any<GetLogInfoRequest>());
    }
}