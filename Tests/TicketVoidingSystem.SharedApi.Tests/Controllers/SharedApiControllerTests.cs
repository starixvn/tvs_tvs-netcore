using Microsoft.AspNetCore.Http;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Controllers;
using Xunit;

namespace TicketVoidingSystem.SharedApi.Tests.Controllers
{
    public class SharedApiControllerTests
    {
        [Fact()]
        public void GetPermission_HasRequest_ReturnIActionResult()
        {
            // Arrange
            var httpContextAccessortor = Substitute.For<IHttpContextAccessor>();
            var controller = new SharedApiController(httpContextAccessortor);

            // Act
            var actual = controller.GetNapUserInfo();

            // Assert
            Assert.NotNull(actual);
        }
    }
}