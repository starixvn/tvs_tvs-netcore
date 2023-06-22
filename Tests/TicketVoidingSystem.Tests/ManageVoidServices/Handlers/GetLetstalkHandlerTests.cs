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

public class GetLetstalkHandlerTests
{
    [Fact]
    public async Task Handle_HasRequest_ReturnExpected()
    {
        // Arrange
        var model = new LetstalkModel();
        var expected = new List<LetstalkModel> { model };
        var request = new GetLetstalkRequest();
        var queueService = Substitute.For<LetstalkService>();
        queueService.GetLetstalkModel(1, "1").ReturnsForAnyArgs(expected);
        var handler = new GetLetstalkHandler(queueService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await queueService.Received(1)
            .GetLetstalkModel(Arg.Compat.Is<int>(x => x == request.RequestId),
                Arg.Compat.Is<string>(x => x == request.BroadcastSessionId));
        Assert.Equal(expected.Count, actual.Count());
    }

}