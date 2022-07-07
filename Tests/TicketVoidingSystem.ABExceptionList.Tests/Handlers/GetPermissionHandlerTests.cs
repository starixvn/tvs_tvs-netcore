using System.Threading.Tasks;
using Fanex.NAP.Core.Business;
using NSubstitute;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.Core.Services;
using TicketVoidingSystem.Core.Web;
using Xunit;

namespace TicketVoidingSystem.ABExceptionList.Tests.Handlers
{
    public class GetPermissionHandlerTests
    {
        [Fact()]
        public async Task Handler_RepositoryHasCalled_ReturnTrue()
        {
            // Arrange
            var request = new GetPermissionRequest();
            var sessionService = Substitute.For<SessionService>();
            sessionService.HasPermission(SpecialDeleteFunctionKeys.ABExceptionList, Arg.Compat.Any<Constant.Policy>()).Returns(true);
            var handler = new GetPermissionHandler(sessionService);

            // Act
            var actualResult = await handler.Handle(request, default);

            // Assert
            Assert.True(actualResult.ABExceptionListHost);
        }
    }
}