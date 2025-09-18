using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Handlers;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;
using Xunit;

namespace TicketVoidingSystem.Tests.MarkTickets.Handlers;

using Fanex.NAP.Client.Helpers.Business;

public class GetDataPermissionHandlerTests
{
    [Fact]
    public async Task GetDataPermission_ValidRequest_HasPermission()
    {
        // Arrange
        var request = new GetDataPermissionRequest();
        var sessionService = Substitute.For<SessionService>();
        sessionService.HasPermission(null, default)
            .ReturnsForAnyArgs(true);
        var handler = new GetDataPermissionHandler(sessionService);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        await sessionService.Received(1).HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Read);

        Assert.True(result.IsReadMarkTickets);
    }
}