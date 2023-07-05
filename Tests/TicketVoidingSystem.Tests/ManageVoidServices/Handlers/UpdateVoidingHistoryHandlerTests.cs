using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageVoidServices.Handlers;

public class UpdateVoidingHistoryHandlerTests
{
    [Fact]
    public async Task Handle_HasRequest_VoidingHistoryServiceHasCalledUpdateVoidingHistory()
    {
        // Arrange
        var request = new UpdateVoidingHistoryRequest();
        var voidingHistoryService = Substitute.For<VoidingHistoryService>();
        var handler = new UpdateVoidingHistoryHandler(voidingHistoryService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await voidingHistoryService.Received(1).UpdateVoidingHistory(
            Arg.Compat.Is<int>(x => x == request.VoidingHistoryId),
            Arg.Compat.Is<int>(x => x == request.StatusId));
        Assert.True(actual);
    }
}