using System.Threading.Tasks;
using MediatR;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Controllers;
using TicketVoidingSystem.SharedApi.Handlers.SubParlayTicket;
using Xunit;

namespace TicketVoidingSystem.SharedApi.Tests.Controllers;

public class SubParlayTicketControllerTests
{
    private readonly IMediator mediator;
    private readonly SubParlayTicketController controller;

    public SubParlayTicketControllerTests()
    {
        mediator = Substitute.For<IMediator>();
        controller = new SubParlayTicketController(mediator);
    }

    [Fact]
    public async Task GetNormalParlay_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetNormalParlayRequest(); ;
        
        // Act
        await controller.GetNormalParlay(request);

        // Assert
        await mediator.Received().Send(request);
    }

    [Fact]
    public async Task GetComboParlay_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetComboParlayRequest(); ;
        
        // Act
        await controller.GetComboParlay(request);

        // Assert
        await mediator.Received().Send(request);
    }
    
    [Fact]
    public async Task GetSelectionsSMP_HasRequest_CallMediatorRequest()
    {
        // Arrange
        var request = new GetSelectionsSMPRequest(); ;
        
        // Act
        await controller.GetSelectionsSMP(request);

        // Assert
        await mediator.Received().Send(request);
    }
}