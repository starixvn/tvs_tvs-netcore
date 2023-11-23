using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.UploadBatchMessage.Handlers;
using SpecialDelete.UploadBatchMessage.Models;
using SpecialDelete.UploadBatchMessage.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.UploadBatchMessage.Handlers;

public class CheckTransIdsHandlerTest
{
    [Fact]
    public async Task Handler_HasCheckTransIdsRequest_CallGetReceiveUsers()
    {
        // Arrange
        var request = new CheckTransIdsRequest { TransIds = "123" };
        var batchMessageService = Substitute.For<BatchMessageService>();
        var handler = new CheckTransIdsHandler(batchMessageService);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await batchMessageService.Received()
            .GetReceivedUsers(Arg.Is<CheckTransIdsQueryModel>(x => x.TransIds == request.TransIds));
    }
}