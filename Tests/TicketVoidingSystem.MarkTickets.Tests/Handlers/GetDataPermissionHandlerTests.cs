using Fanex.NAP.Core.Business;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Handlers;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Handlers;

public class GetDataPermissionHandlerTests
{
    [Fact]
    public async Task GetDataPermission_ValidRequest_HasPermission()
    {
        // Arrange
        var request = new GetDataPermissionRequest();
        var sessionService = Substitute.For<SessionService>();
        sessionService.HasPermission(default, default)
            .ReturnsForAnyArgs(true);
        var handler = new GetDataPermissionHandler(sessionService);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        sessionService.Received(1).HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Read);

        Assert.True(result.IsReadMarkTickets);
    }
}