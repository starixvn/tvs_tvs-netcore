using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.ManageVoidServices.Tests.Handlers
{
    public class UpdateAutoVoidRequestQueueHandlerTests
    {
        [Fact]
        public async Task Handle_HasRequest_ReturnTrue()
        {
            // Arrange
            var request = new UpdateAutoVoidRequestQueueRequest();
            var queueService = Substitute.For<AutoVoidRequestQueueService>();
            var handler = new UpdateAutoVoidRequestQueueHandler(queueService);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.True(actual);
        }
    }
}