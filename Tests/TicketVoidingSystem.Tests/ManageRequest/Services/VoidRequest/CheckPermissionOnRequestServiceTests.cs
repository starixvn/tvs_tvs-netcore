using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest
{
    using Fanex.NAP.Client.Helpers.Business;

    public class CheckPermissionOnRequestServiceTests
    {
        [Fact]
        public async Task IsUserHasPermissionAccessRequest_Return_ReturnTrue()
        {
            // Arrange
            var repository = Substitute.For<IDynamicRepository>();
            var firstResultSet = new List<RequestDetailModel> { new() { IssueTypeId = 11 } };
            repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, PlayerName>(Arg.Any<GetRequestCriteria>())
                .ReturnsForAnyArgs((firstResultSet, null, null));
            var sessionService = Substitute.For<SessionService>();
            sessionService.HasPermission(Arg.Compat.Any<string>(), Constant.Policy.Read).ReturnsForAnyArgs(true);
            var service = new CheckPermissionOnRequestServiceImp(repository, sessionService);

            // Act
            var actual = await service.IsHasPermissionOnRequest(12345);

            // Assert
            Assert.True(actual);
        }

        [Fact]
        public async Task IsUserHasPermissionAccessRequest_Return_ReturnFalse()
        {
            // Arrange
            var repository = Substitute.For<IDynamicRepository>();
            var service = new CheckPermissionOnRequestServiceImp(repository, null);
            var firstResultSet = new List<RequestDetailModel>();
            repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, PlayerName>(Arg.Any<GetRequestCriteria>())
                .ReturnsForAnyArgs((firstResultSet, null, null));

            // Act
            var actual = await service.IsHasPermissionOnRequest(12345);

            // Assert
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