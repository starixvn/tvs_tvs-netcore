using System.Threading.Tasks;
using MediatR;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Controllers;
using TicketVoidingSystem.SharedApi.Handlers.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Controllers;

public class SendEmailControllerTests
{
    private readonly SendEmailController controller;
    private readonly IMediator mediator;

    public SendEmailControllerTests()
    {
        mediator = Substitute.For<IMediator>();
        controller = new SendEmailController(mediator);
    }

    [Fact]
    public async Task Send_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.Send(null);

        // Assert
        await mediator.Received(1).Send(Arg.Any<SendEmailApiRequest>());
    }


    [Fact]
    public async Task SendEmailDuplicateTickets_HasRequest_CallMediatorRequest()
    {
        // Arrange
        // Act
        await controller.SendEmailDuplicateTickets(null);

        // Assert
        await mediator.Received(1).Send(Arg.Any<SendEmailApiDuplicateTicketsRequest>());
    }
}