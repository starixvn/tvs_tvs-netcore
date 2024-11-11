using System.Net;
using System.Threading.Tasks;
using Fanex.NAP.Client;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Business;
using Fanex.NAP.Client.Models;
using Fanex.NAP.Client.Services;
using Microsoft.AspNetCore.Http;
using NSubstitute;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services;

public class SessionServiceTests
{
    private readonly INapSession currentSession;
    private readonly IUserService userService;
    private readonly IHttpContextAccessor httpContextAccessor;
    private SessionServiceImp service;

    public SessionServiceTests()
    {
        userService = Substitute.For<IUserService>();
        currentSession = Substitute.For<INapSession>();
        var siteSettings = Substitute.For<INapSettings>();
        httpContextAccessor = Substitute.For<IHttpContextAccessor>();
        service = new SessionServiceImp(currentSession, userService, siteSettings, httpContextAccessor);
    }

    [Fact]
    public async Task HasPermission_HavePermission_ReturnTrue()
    {
        // Arrange
        userService.IsHavingPermissionAsync(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>(),
            Arg.Any<Constant.Policy>()).ReturnsForAnyArgs(true);

        // Act
        var actual = await service.HasPermission("", Constant.Policy.Host);

        // Assert
        await userService.Received().IsHavingPermissionAsync(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>(), Arg.Any<Constant.Policy>());
        Assert.True(actual);
    }

    [Fact]
    public void GetClientIp_HaveIPAddress_ReturnIPLocal()
    {
        // Arrange
        httpContextAccessor.HttpContext.Connection.RemoteIpAddress = IPAddress.Parse("127.0.0.1");
        httpContextAccessor.HttpContext.Connection.LocalIpAddress = IPAddress.Parse("127.0.0.1");

        service = new SessionServiceImp(null, null, null, httpContextAccessor);

        // Act
        var actual = service.GetClientIp();

        // Assert
        Assert.Equal("127.0.0.1", actual);
    }

    [Fact]
    public void GetClientIp_HaveIPAddress_ReturnIPRemote()
    {
        // Arrange
        var ipLocal = IPAddress.Parse("127.0.0.1");
        var ipRemote = IPAddress.Parse("127.0.0.2");
        httpContextAccessor.HttpContext.Connection.RemoteIpAddress = ipRemote;
        httpContextAccessor.HttpContext.Connection.LocalIpAddress = ipLocal;

        service = new SessionServiceImp(null, null, null, httpContextAccessor);

        // Act
        var actual = service.GetClientIp();

        // Assert
        Assert.Equal(ipRemote.ToString(), actual);
    }

    [Fact]
    public void UserName_HasName_ReturnExpected()
    {
        // Arrange
        currentSession.UserName = "AAA";
        service = new SessionServiceImp(currentSession, null, null, null);

        // Act
        var actual = service.UserName;

        // Assert
        Assert.Equal(currentSession.UserName, actual);
    }

    [Fact]
    public void CheckPassword_DataValid_ReturnTrue()
    {
        // Arrange
        currentSession.UserId = 1;
        userService.Get(1).ReturnsForAnyArgs(new User { Password = "1" });

        // Act
        var actual = service.CheckPassword("1");

        // Assert
        Assert.True(actual);
    }
}