using System.Threading.Tasks;
using MediatR;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Controllers;
using TicketVoidingSystem.SharedApi.Handlers.MatchInfo;
using Xunit;

namespace TicketVoidingSystem.SharedApi.Tests.Controllers;

public class MatchInfoControllerTests
{
    private readonly IMediator mediator;
    private readonly MatchInfoController controller;

    public MatchInfoControllerTests()
    {
        mediator = Substitute.For<IMediator>();
        controller = new MatchInfoController(mediator);
    }

    [Fact]
    public async Task GetInfo_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetMatchInfoRequest { MatchId = 123456 };
        
        // Act
        await controller.GetInfo(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task GetFirstTimeAndKickOffTime_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = 123456;;
        
        // Act
        await controller.GetFirstTimeAndKickOffTime(request);

        // Assert
        await mediator.Received().Send(Arg.Any<GetFirstTimeAndKickOffTimeRequest>());
    }
}