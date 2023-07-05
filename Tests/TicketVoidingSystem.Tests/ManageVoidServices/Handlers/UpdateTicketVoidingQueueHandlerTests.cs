using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageVoidServices.Handlers;

public class UpdateTicketVoidingQueueHandlerTests
{
    // Jacob Good
    [Fact]
    public async Task Handle_HasRequest_ReturnTrue()
    {
        // Arrange
        var request = new UpdateTicketVoidingQueueRequest();
        var queueService = Substitute.For<TicketVoidingQueueService>();
        var handler = new UpdateTicketVoidingQueueHandler(queueService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.True(actual);
    }
}