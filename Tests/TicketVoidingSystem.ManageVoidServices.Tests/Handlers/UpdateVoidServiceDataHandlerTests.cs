using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.ManageVoidServices.Tests.Handlers
{
    public class UpdateVoidServiceDataHandlerTests
    {
        [Fact]
        public async Task Handle_HasRequest_ReturnTrue()
        {
            // Arrange
            var request = new UpdateVoidServiceDataRequest();
            var checkingVoidStatusService = Substitute.For<CheckingVoidStatusService>();
            var handler = new UpdateVoidServiceDataHandler(checkingVoidStatusService);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.True(actual);
        }
    }
}