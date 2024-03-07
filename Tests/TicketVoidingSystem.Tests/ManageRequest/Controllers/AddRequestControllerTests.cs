using System.Threading.Tasks;
using MediatR;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Controllers;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Controllers;

public class AddRequestControllerTests
{
    private readonly AddRequestController controller;
    private readonly IMediator mediator;

    public AddRequestControllerTests()
    {
        mediator = Substitute.For<IMediator>();
        controller = new AddRequestController(mediator);
    }

    [Fact]
    public async Task GetLogInfo_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetLogInfo(null);

        // Assert
        await mediator.Received().Send(Arg.Any<GetLogInfoRequest>());
    }

    [Fact]
    public async Task GetWrongScoreInfo_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetWrongScoreInfo(null);

        // Assert
        await mediator.Received().Send(Arg.Any<GetWrongScoreInfoRequest>());
    }

    [Fact]
    public async Task GetLastTimeScore_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetLastTimeScore(null);

        // Assert
        await mediator.Received().Send(Arg.Any<GetLastTimeScoreRequest>());
    }

    [Fact]
    public async Task GetChildMatches_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetChildMatches(null);

        // Assert
        await mediator.Received().Send(Arg.Any<GetChildMatchesRequest>());
    }

    [Fact]
    public async Task GetSubIssueTypeLinkMatch_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetSubIssueTypeLinkMatch(null);

        // Assert
        await mediator.Received().Send(Arg.Any<GetSubIssueTypeLinkMatchRequest>());
    }

    [Fact]
    public async Task CheckTickets14_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.CheckTickets14(null);

        // Assert
        await mediator.Received().Send(Arg.Any<CheckTickets14Request>());
    }

    [Fact]
    public async Task CheckValidTransIdsRequest_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.CheckValidTransIdsRequest(null);

        // Assert
        await mediator.Received().Send(Arg.Any<CheckValidTransIdsRequest>());
    }

    [Fact]
    public async Task CheckValidUsernames_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.CheckValidUsernames(null);

        // Assert
        await mediator.Received().Send(Arg.Any<CheckValidUsernamesRequest>());
    }

    [Fact]
    public async Task CheckDuplicateTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.CheckDuplicateTickets(null);

        // Assert
        await mediator.Received().Send(Arg.Any<CheckDuplicateTicketsRequest>());
    }

    [Fact]
    public async Task GetLinkedLog_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetLinkedLog(null);

        // Assert
        await mediator.Received().Send(Arg.Any<GetLinkedLogRequest>());
    }

    [Fact]
    public async Task GetPoolHouseTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetPoolHouseTickets(null);

        // Assert
        await mediator.Received().Send(Arg.Any<GetPoolHouseTicketRequest>());
    }

    [Fact]
    public async Task GetReducedOverBetTypes_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetReducedOverBetTypes(null);

        // Assert
        await mediator.Received().Send(Arg.Any<GetReducedOverBetTypesRequest>());
    }

    [Fact]
    public async Task GetOperators_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetOperators(null);

        // Assert
        await mediator.Received().Send(Arg.Any<GetOperatorsRequest>());
    }

    [Fact]
    public async Task GetProvider_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetProvider(null);

        // Assert
        await mediator.Received().Send(Arg.Any<GetProviderRequest>());
    }

    [Fact]
    public async Task AddRequest_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.AddRequest(null);

        // Assert
        await mediator.Received().Send(Arg.Any<AddRequest>());
    }

    [Fact]
    public async Task GetSubIssueTypeNote_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetSubIssueTypeNote(null);

        // Assert
        await mediator.Received().Send(Arg.Any<GetSubIssueTypeNoteRequest>());
    }

    [Fact]
    public async Task SaveSubIssueTypeNote_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.SaveSubIssueTypeNote(null);

        // Assert
        await mediator.Received().Send(Arg.Any<SaveSubIssueTypeNoteRequest>());
    }

    [Fact]
    public async Task GetPermission_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.GetPermission();

        // Assert
        await mediator.Received().Send(Arg.Any<GetPermissionRequest>());
    }
}