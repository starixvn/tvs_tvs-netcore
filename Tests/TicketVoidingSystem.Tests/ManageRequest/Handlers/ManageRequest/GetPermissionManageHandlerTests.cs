using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest;

using Fanex.NAP.Client.Helpers.Business;

public class GetPermissionManageHandlerTests
{
    [Fact]
    public async Task Handler_RepositoryExecute_CallSessionHasPermission()
    {
        // Arrange
        var expected = new PermissionManage
        {
            ManageRequestHost = true,
            VerifyRead = true,
            VerifyHost = true,
            VoidRead = true,
            ManageRequestUnsettledTicketsHost = true,
            ManageRequestSettledTicketsHost = true,
            IsReadMarkTickets = true
        };

        var request = new GetPermissionManageRequest();
        var session = Substitute.For<SessionService>();
        session.HasPermission(Arg.Any<string>(), Constant.Policy.Host).Returns(true);
        session.HasPermission(Arg.Any<string>(), Constant.Policy.Read).Returns(true);
        session.HasPermission(Arg.Any<string>(), Constant.Policy.Read).Returns(true);

        var handler = new GetPermissionManageHandler(session);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await session.Received(4).HasPermission(Arg.Compat.Any<string>(), Constant.Policy.Host);
        await session.Received(3).HasPermission(Arg.Compat.Any<string>(), Constant.Policy.Read);
        AssertExtension.Equal(expected.ManageRequestHost, actual.ManageRequestHost);
        AssertExtension.Equal(expected.VerifyHost, actual.VerifyHost);
        AssertExtension.Equal(expected.VerifyRead, actual.VerifyRead);
        AssertExtension.Equal(expected.VoidRead, actual.VoidRead);
        AssertExtension.Equal(expected.ManageRequestSettledTicketsHost, actual.ManageRequestSettledTicketsHost);
        AssertExtension.Equal(expected.ManageRequestUnsettledTicketsHost, actual.ManageRequestUnsettledTicketsHost);
    }
}