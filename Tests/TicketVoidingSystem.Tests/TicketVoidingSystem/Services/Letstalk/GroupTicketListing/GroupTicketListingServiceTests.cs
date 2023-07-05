using System.Threading.Tasks;
using Xunit;
using NSubstitute;
using Fanex.LetstalkService.Core.Models;
using TicketVoidingSystem.Services.Letstalk.GroupTicketListing;
using TicketVoidingSystem.Services.Letstalk;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.Letstalk.GroupTicketListing
{
    public class GroupTicketListingServiceTests
    {
        [Fact]
        public async Task SendMessage_HasCalled_HasCallSendLetstalkSingleMessage()
        {
            // Arrange
            var letstalkModel = new LetstalkModel(); 
            var content = "Test Content";
            var attachment = new LetstalkAttachment(); 

            var letstalkSingleMessageService = Substitute.For<LetstalkSingleMessageService>(); 

            var service = new GroupTicketListingServiceImp(letstalkSingleMessageService);

            // Act
            _ = await service.SendMessage(letstalkModel, content, attachment);

            // Assert
            await letstalkSingleMessageService.Received(1).Send(letstalkModel, attachment); 
            Assert.Equal(content, letstalkModel.Content); 
        }

    }
}
