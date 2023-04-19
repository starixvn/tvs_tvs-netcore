using MediatR;
using Microsoft.AspNetCore.Http;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Controllers;
using Xunit;

namespace TicketVoidingSystem.SharedApi.Tests.Controllers;

public class SharedApiControllerTests
{
    [Fact()]
    public void GetPermission_HasRequest_ReturnIActionResult()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var httpContextAccessor = Substitute.For<IHttpContextAccessor>();
        var controller = new SharedApiController(mediator, httpContextAccessor);

        // Act
        var actual = controller.GetNapUserInfo();

        // Assert
        Assert.NotNull(actual);
    }
}