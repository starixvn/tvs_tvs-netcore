using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.ManageVoidServices.Tests.Handlers
{
    public class UpdateTicketVoidingQueueHandlerTests
    {
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
}