using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.ManageVoidServices.Tests.Handlers;

public class GetTicketVoidingQueueHandlerTests
{
    // Jacob thấy expectedCount là 1 thôi mà, sao ko đổi tên testcase lại
    [Fact]
    public async Task Handle_HasRequest_ReturnExpected()
    {
        // Arrange
        var model = new TicketVoidingQueueModel();
        var expected = new List<TicketVoidingQueueModel> { model };
        var request = new GetTicketVoidingQueueRequest();
        var queueService = Substitute.For<TicketVoidingQueueService>();
        queueService.GetQueueInAllServers(1).ReturnsForAnyArgs(expected);
        var handler = new GetTicketVoidingQueueHandler(queueService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await queueService.Received(1)
            .GetQueueInAllServers(Arg.Compat.Is<int>(x => x == request.VoidingHistoryId));
        Assert.Equal(expected.Count, actual.Count());
    }
}