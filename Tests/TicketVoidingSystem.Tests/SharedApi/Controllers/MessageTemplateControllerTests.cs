using System.Threading.Tasks;
using MediatR;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Controllers;
using TicketVoidingSystem.SharedApi.Handlers.MessageTemplate;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Controllers;

public class MessageTemplateControllerTests
{
    private readonly IMediator mediator;
    private readonly MessageTemplateController controller;

    public MessageTemplateControllerTests()
    {
        mediator = Substitute.For<IMediator>();
        controller = new MessageTemplateController(mediator);
    }

    [Fact]
    public async Task GetTemplateSettings_HasRequest_CallMediatorRequest()
    {
        // Arrange
        
        // Act
        await controller.GetTemplateSettings();

        // Assert
        await mediator.Received().Send(Arg.Any<GetTemplateSettingRequest>());
    }

}