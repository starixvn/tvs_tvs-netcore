using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.ManageVoidServices.Tests.Handlers
{
    public class UpdateVoidBetAutomationHandlerTests
    {
        [Fact]
        public async Task Handle_HasRequest_ReturnTrue()
        {
            // Arrange
            var request = new UpdateVoidBetAutomationInfoRequest();
            var afterVoidService = Substitute.For<AfterVoidService>();
            var handler = new UpdateVoidBetAutomationHandler(afterVoidService);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.True(actual);
        }

        //[Fact]
        //public async Task Handle_HasRequest_ReturnFalse()
        //{
        //    // Arrange
        //    var request = new UpdateVoidBetAutomationInfoRequest();
        //    var afterVoidService = Substitute.For<AfterVoidService>();
        //    afterVoidService.When(x => x.UpdateVoidBetAutomationServiceInfo(new VoidBetAutomationModel()))
        //        .Do(x => throw new Exception());
        //    var handler = new UpdateVoidBetAutomationHandler(afterVoidService);

        //    // Act
        //    var actual = await handler.Handle(request, CancellationToken.None);

        //    // Assert
        //    Assert.False(actual);
        //}
    }
}