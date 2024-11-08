using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.VoidRequest;

public class CheckAccessRequestPermissionHandlerTests
{
    [Fact]
    public async Task Handle_ValidRequest_ReturnTrue()
    {
        // Arrange
        var request = new CheckAccessRequestPermissionRequest();
        var checkPermissionOnRequestService = Substitute.For<CheckPermissionOnRequestService>();
        checkPermissionOnRequestService.IsHasPermissionOnRequest(default).ReturnsForAnyArgs(true);

        var handler = new CheckAccessRequestPermissionHandler(checkPermissionOnRequestService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.True(actual);
    }
}