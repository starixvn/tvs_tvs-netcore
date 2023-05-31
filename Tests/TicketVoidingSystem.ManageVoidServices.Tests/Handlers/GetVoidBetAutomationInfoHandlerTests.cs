using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Handlers;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.ManageVoidServices.Tests.Handlers;

public class GetVoidBetAutomationInfoHandlerTests
{
    // Có thể đổi tên test case cho rõ hơn. IsAutoVoid = false?
    [Fact]
    public async Task Handle_HasRequest_ReturnExpected()
    {
        // Arrange
        var expected = new VoidBetAutomationModel { IsAutoVoid = false };
        var request = new GetVoidBetAutomationInfoRequest();
        var afterVoidService = Substitute.For<AfterVoidService>();
        afterVoidService.GetVoidBetAutomationServiceInfo(null).ReturnsForAnyArgs(expected);
        var handler = new GetVoidBetAutomationInfoHandler(afterVoidService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await afterVoidService.Received(1)
            .GetVoidBetAutomationServiceInfo(
                Arg.Compat.Is<VoidBetAutomationModel>(x => x.MatchId == request.MatchId));
        Assert.Equal(expected, actual);
    }
}