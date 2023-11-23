using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using MediatR;
using NSubstitute;
using SpecialDelete.UploadBatchMessage.Controllers;
using SpecialDelete.UploadBatchMessage.Handlers;
using TicketVoidingSystem.Models.SendMessage;
using Xunit;

namespace TicketVoidingSystem.Tests.UploadBatchMessage.Controllers;


public class UploadBatchMessageControllerTest
{
    [Fact]
    public async Task GetProducts_HasAction_CallMediatorRequest()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var controller = new UploadBatchMessageController(mediator);

        // Act
        await controller.GetProducts();

        // Assert
        await mediator.Received().Send(Arg.Any<GetProductRequest>());
    }

    [Fact]
    public async Task CheckTransIds_HasRequest_CallMediatorWithRequest()
    {
        // Arrange
        var request = new CheckTransIdsRequest { TransIds = "123465" };
        var mediator = Substitute.For<IMediator>();
        var controller = new UploadBatchMessageController(mediator);

        // Act
        await controller.CheckTransIds(request);

        // Assert
        await mediator.Received()
            .Send(Arg.Is<CheckTransIdsRequest>(x => x.TransIds == request.TransIds));
    }

    [Fact]
    public async Task UpdateMessage_HasRequest_CallMediatorWithRequest()
    {
        // Arrange
        var request = new UpdateMessageRequest
        {
            CreditTrans = new List<ReceivedUser> { new() { CustId = 1 } }
        };

        var mediator = Substitute.For<IMediator>();
        var controller = new UploadBatchMessageController(mediator);

        // Act
        await controller.UpdateMessage(request);

        // Assert
        await mediator.Received()
            .Send(Arg.Is<UpdateMessageRequest>(x => x.CreditTrans[0].CustId == request.CreditTrans[0].CustId));
    }
}