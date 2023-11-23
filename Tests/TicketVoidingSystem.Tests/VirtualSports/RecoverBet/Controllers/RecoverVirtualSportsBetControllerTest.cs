using System.ComponentModel;
using System.Threading.Tasks;
using MediatR;
using NSubstitute;
using SpecialDelete.VirtualSports.RecoverBet.Controllers;
using SpecialDelete.VirtualSports.RecoverBet.Handlers;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Controllers;


public class RecoverVirtualSportsBetControllerTest
{
    [Fact]
    public async Task GetTickets_HasRequest_SendRequestByMediator()
    {
        // Arrange
        var request = new GetTicketsRequest { MatchId = 132 };
        var mediator = Substitute.For<IMediator>();
        var controller = new RecoverVirtualSportsBetController(mediator);

        // Act
        await controller.GetTickets(request);

        // Assert
        await mediator.Received().Send(Arg.Is<GetTicketsRequest>(x => x.MatchId == request.MatchId));
    }

    [Fact]
    public async Task RecoverTickets_HasRequest_SendRequestByMediator()
    {
        // Arrange
        var request = new RecoverTicketsRequest { TransIds = "12346" };
        var mediator = Substitute.For<IMediator>();
        var controller = new RecoverVirtualSportsBetController(mediator);

        // Act
        await controller.RecoverTickets(request);

        // Assert
        await mediator.Received().Send(Arg.Is<RecoverTicketsRequest>(x => x.MatchId == request.MatchId));
    }
}