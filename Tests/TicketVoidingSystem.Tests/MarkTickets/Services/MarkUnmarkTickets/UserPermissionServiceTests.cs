using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;
using Xunit;

namespace TicketVoidingSystem.Tests.MarkTickets.Services.MarkUnmarkTickets
{
    using Fanex.NAP.Client.Helpers.Business;

    public class UserPermissionServiceTests
    {
        private readonly SessionService sessionService;
        private readonly UserPermissionServiceImp service;

        public UserPermissionServiceTests()
        {
            sessionService = Substitute.For<SessionService>();
            service = new UserPermissionServiceImp(sessionService);
        }

        [Fact]
        public async Task GetUserPermission_HasCalled_ReturnUserPermission()
        {
            // Arrange
            sessionService.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Host).Returns(true);
            sessionService.HasPermission(SpecialDeleteFunctionKeys.ViewUsernameOfSpecialSiteOnBetList, Constant.Policy.Read).Returns(true);

            // Act
            var actual = await service.GetUserPermission();

            // Assert
            Assert.True(actual.MarkTickets);
            Assert.True(actual.ViewUserName);
        }

    }
}
