using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageVoidServices.Handlers;

public class GetAutoVoidRequestQueueHandlerTests
{
    // Jacob thấy expectedCount là 1 thôi mà, sao ko đổi tên testcase lại
    [Fact]
    public async Task Handle_HasRequest_ReturnExpected()
    {
        // Arrange
        var model = new AutoVoidRequestQueueModel();
        var expected = new List<AutoVoidRequestQueueModel> { model };
        var request = new GetAutoVoidRequestQueueRequest();
        var queueService = Substitute.For<AutoVoidRequestQueueService>();
        queueService.GetQueueInAllServers("1", 1).ReturnsForAnyArgs(expected);
        var handler = new GetAutoVoidRequestQueueHandler(queueService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await queueService.Received(1)
            .GetQueueInAllServers(Arg.Compat.Is<string>(x => x == request.BroadcastSessionId),
                Arg.Compat.Is<int?>(x => x == request.StatusId));
        Assert.Equal(expected.Count, actual.Count());
    }
}