using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageVoidServices.Handlers;

public class GetVoidingHistoryHandlerTests
{
    [Fact]
    public async Task Handle_HasRequest_VoidingHistoryServiceHasCalledGetByRequestId()
    {
        // Arrange
        var expected = new List<VoidingHistoryModel>();
        var request = new GetVoidingHistoryRequest();
        var voidingHistoryService = Substitute.For<VoidingHistoryService>();
        voidingHistoryService.GetByRequestId(1).ReturnsForAnyArgs(expected);
        var handler = new GetVoidingHistoryHandler(voidingHistoryService);

        // Act
        _ = await handler.Handle(request, CancellationToken.None);

        // Assert
        await voidingHistoryService.Received(1).GetByRequestId(Arg.Compat.Is<int>(x => x == request.RequestId));
    }
}