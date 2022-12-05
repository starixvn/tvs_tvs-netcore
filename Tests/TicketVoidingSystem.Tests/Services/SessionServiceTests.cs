using System.Net;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Common;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Client.Models;
using Fanex.NAP.Client.Services;
using Fanex.NAP.Core.Business;
using Microsoft.AspNetCore.Http;
using NSubstitute;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.Services
{
    public class SessionServiceTests
    {
        [Fact]
        public void HasPermission_HavePermission_ReturnTrue()
        {
            // Arrange
            var userService = Substitute.For<IUserService>();
            var currentSession = Substitute.For<INapSession>();
            var siteSettings = Substitute.For<INapSettings>();

            userService.IsHavingPermission(Arg.Compat.Any<int>(), Arg.Compat.Any<int>(), Arg.Compat.Any<string>(),
                Arg.Compat.Any<Constant.Policy>()).ReturnsForAnyArgs(true);
            var service = new SessionServiceImp(currentSession, userService, siteSettings, null);

            // Act
            var actual = service.HasPermission("", Constant.Policy.Host);

            // Assert
            userService.Received(1).IsHavingPermission(Arg.Compat.Any<int>(), Arg.Compat.Any<int>(),
                Arg.Compat.Any<string>(),
                Arg.Compat.Any<Constant.Policy>());
            Assert.True(actual);
        }

        [Fact]
        public void GetClientIp_HaveIPAddress_ReturnIPLocal()
        {
            // Arrange
            var httpContextAccessor = Substitute.For<IHttpContextAccessor>();
            httpContextAccessor.HttpContext.Connection.RemoteIpAddress = IPAddress.Parse("127.0.0.1");
            httpContextAccessor.HttpContext.Connection.LocalIpAddress = IPAddress.Parse("127.0.0.1");

            var service = new SessionServiceImp(null, null, null, httpContextAccessor);

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
            var httpContextAccessor = Substitute.For<IHttpContextAccessor>();
            httpContextAccessor.HttpContext.Connection.RemoteIpAddress = ipRemote;
            httpContextAccessor.HttpContext.Connection.LocalIpAddress = ipLocal;

            var service = new SessionServiceImp(null, null, null, httpContextAccessor);

            // Act
            var actual = service.GetClientIp();

            // Assert
            Assert.Equal(ipRemote.ToString(), actual);
        }

        [Fact]
        public void CheckPassword_IsCorrectPassword_ReturnTrue()
        {
            // Arrange
            const string password = "password";
            var user = new User { Username = "A", Id = 1, Password = Cryptography.CfsEnCode(password) };
            var userService = Substitute.For<IUserService>();
            var currentSession = Substitute.For<INapSession>();
            userService.Get(Arg.Compat.Any<int>()).ReturnsForAnyArgs(user);
            var service = new SessionServiceImp(currentSession, userService, null, null);

            // Act
            var actual = service.CheckPassword("password");

            // Assert
            Assert.True(actual);
        }

        [Fact]
        public void UserName_HasName_ReturnExpected()
        {
            // Arrange
            var currentSession = Substitute.For<INapSession>();
            currentSession.UserName = "AAA";
            var service = new SessionServiceImp(currentSession, null, null, null);

            // Act
            var actual = service.UserName;

            // Assert
            Assert.Equal(currentSession.UserName, actual);
        }
    }
}