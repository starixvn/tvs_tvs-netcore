using System.Threading;
using System.Threading.Tasks;
using Fanex.NAP.Client.Helpers.Business;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class GetPermissionVoidAllArchivedTicketHandlerTests
{
    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Handler_RepositoryExecute_CallSessionHasPermission(bool isHasPermission)
    {
        // Arrange
        var request = new GetPermissionRequest();
        var session = Substitute.For<SessionService>();
        session.HasPermission(Arg.Any<string>(), Constant.Policy.Host).Returns(isHasPermission);

        var handler = new GetPermissionHandler(session);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await session.Received(1).HasPermission(Arg.Compat.Any<string>(), Constant.Policy.Host);
        Assert.Equal(isHasPermission, actual.IsVoidAllArchivedTickets);
    }
}