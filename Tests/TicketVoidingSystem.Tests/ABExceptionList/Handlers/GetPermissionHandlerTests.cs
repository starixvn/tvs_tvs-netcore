using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;
using Xunit;

namespace TicketVoidingSystem.Tests.ABExceptionList.Handlers;

using Fanex.NAP.Client.Helpers.Business;

public class GetPermissionHandlerTests
{
    [Fact]
    public async Task Handler_RepositoryHasCalled_ReturnTrue()
    {
        // Arrange
        var request = new GetPermissionRequest();
        var sessionService = Substitute.For<SessionService>();
        sessionService.HasPermission(SpecialDeleteFunctionKeys.ABExceptionList, Arg.Any<Constant.Policy>()).Returns(true);
        var handler = new GetPermissionHandler(sessionService);

        // Act
        var actualResult = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.True(actualResult.ABExceptionListHost);
    }
}