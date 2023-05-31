using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.ManageVoidServices.Tests.Handlers;

public class GetVoidingHistoryHandlerTests
{
    // Jacob thấy expected là empty list thôi mà, sao ko đổi tên testcase lại, đổi lại chỗ Assert
    [Fact]
    public async Task Handle_HasRequest_ReturnExpected()
    {
        // Arrange
        var expected = new List<VoidingHistoryModel>();
        var request = new GetVoidingHistoryRequest();
        var voidingHistoryService = Substitute.For<VoidingHistoryService>();
        voidingHistoryService.GetByRequestId(1).ReturnsForAnyArgs(expected);
        var handler = new GetVoidingHistoryHandler(voidingHistoryService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await voidingHistoryService.Received(1).GetByRequestId(Arg.Compat.Is<int>(x => x == request.RequestId));
        Assert.Equal(expected, actual);
    }
}