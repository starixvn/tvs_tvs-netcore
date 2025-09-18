using System.Threading.Tasks;
using MediatR;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Controllers;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Controllers;

public class BetTypesControllerTests
{
    private readonly IMediator mediator;
    private readonly BetTypesController controller;

    public BetTypesControllerTests()
    {
        mediator = Substitute.For<IMediator>();
        controller = new BetTypesController(mediator);
    }

    [Fact]
    public async Task GetGroupBetTypesNg_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetGroupBetTypesRequest { MatchId = 123456 };

        // Act
        await controller.GetGroupBetTypesNg(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task GetBetTeams_HasRequest_CallMediatorRequest()
    {
        // Arrange

        // Act
        await controller.GetBetTeams();

        // Assert
        await mediator.Received().Send(Arg.Any<GetBetTeamsRequest>());
    }

    [Fact]
    public async Task GetOddsInfoSpecialBetTypes_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetOddsInfoRequest { MatchId = 123456 };

        // Act
        await controller.GetOddsInfoSpecialBetTypes(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task GetVirtualSport_HasRequest_CallMediatorRequest()
    {
        // Arrange

        // Act
        await controller.GetVirtualSport(null);

        // Assert
        await mediator.Received().Send(Arg.Any<GetBetTypesVirtualSportRequest>());
    }

    [Fact]
    public async Task GetBetTypes_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetBetTypesRequest { MatchId = 123456 };

        // Act
        await controller.GetBetTypes(request);

        // Assert
        await mediator.Received().Send(request);
    }
}