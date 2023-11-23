using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.UploadBatchMessage.Handlers;
using SpecialDelete.UploadBatchMessage.Models;
using SpecialDelete.UploadBatchMessage.Services;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.UploadBatchMessage.Handlers;


public class UpdateMessageHandlerTest
{
    [Fact]
    public async Task Handle_ValidUserIdInSession_UpdateCreatorId()
    {
        // Arrange
        const int userId = 8;
        var request = new UpdateMessageRequest { Message = new Message { CreatorId = 0 } };
        var batchMessageService = Substitute.For<BatchMessageService>();
        var sessionService = Substitute.For<SessionService>();
        sessionService.UserId.ReturnsForAnyArgs(userId);
        var handler = new UpdateMessageHandler(batchMessageService, sessionService);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await batchMessageService.Received()
            .UpdateMessage(Arg.Is<UpdateMessageQueryModel>(x => x.Message.CreatorId == userId));
    }

    [Fact]
    public async Task Handle_ValidUserNameInSession_UpdateCreatorName()
    {
        // Arrange
        const string userName = "sa";
        var request = new UpdateMessageRequest { Message = new Message { CreatorName = null } };
        var batchMessageService = Substitute.For<BatchMessageService>();
        var sessionService = Substitute.For<SessionService>();
        sessionService.UserName.ReturnsForAnyArgs(userName);
        var handler = new UpdateMessageHandler(batchMessageService, sessionService);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await batchMessageService.Received()
            .UpdateMessage(Arg.Is<UpdateMessageQueryModel>(x => x.Message.CreatorName == userName));
    }
}