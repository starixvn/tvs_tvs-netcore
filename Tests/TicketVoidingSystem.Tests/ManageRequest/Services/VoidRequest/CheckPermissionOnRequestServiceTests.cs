using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;
using Xunit;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest
{
    using Fanex.NAP.Client.Helpers.Business;

    public class CheckPermissionOnRequestServiceTests
    {
        [Fact]
        public async Task IsUserHasPermissionAccessRequest_Return_ReturnTrue()
        {
            // Arrange
            var model = new RequestModel { RequestId = 12345, IssueTypeId = 11 };
            var repository = Substitute.For<IDynamicRepository>();
            repository.GetAsync<RequestModel>(Arg.Compat.Any<GetRequestCriteria>()).ReturnsForAnyArgs(model);

            var sessionService = Substitute.For<SessionService>();
            sessionService.HasPermission(Arg.Compat.Any<string>(), Constant.Policy.Read).ReturnsForAnyArgs(true);
            var service = new CheckPermissionOnRequestServiceImp(repository, sessionService);

            // Act
            var actual = await service.IsHasPermissionOnRequest(12345);

            // Assert
            await repository.Received(1)
                .GetAsync<RequestModel>(Arg.Compat.Is<GetRequestCriteria>(x => x.RequestId == 12345));
            Assert.True(actual);
        }

        [Fact]
        public async Task IsUserHasPermissionAccessRequest_Return_ReturnFalse()
        {
            // Arrange
            var repository = Substitute.For<IDynamicRepository>();
            var service = new CheckPermissionOnRequestServiceImp(repository, null);

            // Act
            var actual = await service.IsHasPermissionOnRequest(12345);

            // Assert
            await repository.Received(1)
                .GetAsync<RequestModel>(Arg.Compat.Is<GetRequestCriteria>(x => x.RequestId == 12345));
            Assert.False(actual);
        }

        [Fact]
        public async Task GetVoidPermission_Return_VoidPermission()
        {
            // Arrange
            var sessionService = Substitute.For<SessionService>();
            sessionService.HasPermission(Arg.Any<string>(), Constant.Policy.Host).ReturnsForAnyArgs(true);
            var service = new CheckPermissionOnRequestServiceImp(null, sessionService);

            // Act
            var actual = await service.GetVoidPermission();

            // Assert
            await sessionService.Received().HasPermission(Arg.Any<string>(), Constant.Policy.Host);
            Assert.NotNull(actual);
        }
    }
}