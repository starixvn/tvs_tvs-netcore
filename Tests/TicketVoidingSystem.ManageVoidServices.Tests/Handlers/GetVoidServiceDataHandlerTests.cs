using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using TicketVoidingSystem.ManageVoidServices.Models;
using Xunit;

namespace TicketVoidingSystem.ManageVoidServices.Tests.Handlers;

public class GetVoidServiceDataHandlerTests
{
    [Fact]
    public async Task Handle_HasRequest_ReturnExpected()
    {
        // Arrange
        var model = new VoidServiceModel();
        var expected = new List<VoidServiceModel> { model };
        var request = new GetVoidServiceDataRequest();
        var checkingVoidStatusService = Substitute.For<CheckingTicketStatusService>();
        checkingVoidStatusService.GetVoidServiceData("", 1).ReturnsForAnyArgs(expected);
        var handler = new GetVoidServiceDataHandler(checkingVoidStatusService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await checkingVoidStatusService.Received(1).GetVoidServiceData(
            Arg.Compat.Is<string>(x => x == request.BroadcastSessionId),
            Arg.Compat.Is<int?>(x => x == request.RequestId));
        Assert.Equal(expected, actual);
    }
}