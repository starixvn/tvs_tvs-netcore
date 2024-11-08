using System.Threading.Tasks;
using Fanex.LetstalkService.Client.Models;
using NSubstitute;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.Services.Letstalk.GroupTicketListing;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.Letstalk.GroupTicketListing;

public class GroupTicketListingServiceTests
{
    [Fact]
    public async Task SendMessage_HasCalled_HasCallSendLetstalkSingleMessage()
    {
        // Arrange
        var letstalkModel = new LetstalkModel();
        var attachment = new LetstalkAttachment();

        var letstalkSingleMessageService = Substitute.For<LetstalkSingleMessageService>();

        var service = new GroupTicketListingServiceImp(letstalkSingleMessageService);

        // Act
        _ = await service.SendMessage(letstalkModel, attachment);

        // Assert
        await letstalkSingleMessageService.Received(1).Send(letstalkModel, attachment);
    }
}