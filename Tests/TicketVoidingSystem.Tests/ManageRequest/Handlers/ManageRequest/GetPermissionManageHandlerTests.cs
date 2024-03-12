using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest;

using Fanex.NAP.Client.Helpers.Business;
using global::TicketVoidingSystem.Web;

public class GetPermissionVoidAllArchivedTicketHandlerTests
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
            IsReadMarkTickets = true
        };

        var request = new GetPermissionManageRequest();
        var session = Substitute.For<SessionService>();
        session.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingManageRequest, Constant.Policy.Host).Returns(true);
        session.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVerifyRequest, Constant.Policy.Read).Returns(true);
        session.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVerifyRequest, Constant.Policy.Host).Returns(true);
        session.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVoidTickets, Constant.Policy.Read).Returns(true);
        session.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Read).Returns(true);

        var handler = new GetPermissionManageHandler(session);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await session.Received(1).HasPermission(SpecialDeleteFunctionKeys.TicketVoidingManageRequest, Constant.Policy.Host);
        await session.Received(1).HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVerifyRequest, Constant.Policy.Read);
        await session.Received(1).HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVerifyRequest, Constant.Policy.Host);
        await session.Received(1).HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVoidTickets, Constant.Policy.Read);
        await session.Received(1).HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVoidTickets, Constant.Policy.Read);
        AssertExtension.Equal(expected.ManageRequestHost, actual.ManageRequestHost);
        AssertExtension.Equal(expected.VerifyHost, actual.VerifyHost);
        AssertExtension.Equal(expected.VerifyRead, actual.VerifyRead);
        AssertExtension.Equal(expected.VoidRead, actual.VoidRead);
    }
}