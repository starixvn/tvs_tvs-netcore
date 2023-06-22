using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.NAP.Core.Business;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest
{
    public class GetPermissionManageHandlerTests
    {
        [Fact]
        public void Handler_RepositoryExecute_CallSessionHasPermission()
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
            var actual = handler.Handle(request, CancellationToken.None);

            // Assert
            session.Received(4).HasPermission(Arg.Compat.Any<string>(), Constant.Policy.Host);
            session.Received(3).HasPermission(Arg.Compat.Any<string>(), Constant.Policy.Read);
            AssertExtension.Equal(expected.ManageRequestHost, actual.Result.ManageRequestHost);
            AssertExtension.Equal(expected.VerifyHost, actual.Result.VerifyHost);
            AssertExtension.Equal(expected.VerifyRead, actual.Result.VerifyRead);
            AssertExtension.Equal(expected.VoidRead, actual.Result.VoidRead);
            AssertExtension.Equal(expected.ManageRequestSettledTicketsHost, actual.Result.ManageRequestSettledTicketsHost);
            AssertExtension.Equal(expected.ManageRequestUnsettledTicketsHost, actual.Result.ManageRequestUnsettledTicketsHost);
        }
    }
}