using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.ABExceptionList.Models;
using TicketVoidingSystem.ABExceptionList.Services;
using Xunit;

namespace TicketVoidingSystem.ABExceptionList.Tests.Services
{
    public class GetUsersServiceImpTests
    {
        [Fact()]
        public async Task GetUsers_ShouldReturnExpectedData()
        {
            // Arrange
            var fakeData = new List<UserModel> { new() };
            var request = new GetUsersRequest { UserName = "aaaa" };
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<UserModel>(Arg.Compat.Any<GetUsersRequest>()).ReturnsForAnyArgs(fakeData);
            var service = new GetUsersServiceImp(repository);

            // Act
            var actual = await service.GetUsers(request);

            // Assert
            await repository.Received(1).FetchAsync<UserModel>(Arg.Compat.Is<GetUsersRequest>(x => x.UserName == request.UserName));
            Assert.Equal(fakeData, actual);
        }
    }
}