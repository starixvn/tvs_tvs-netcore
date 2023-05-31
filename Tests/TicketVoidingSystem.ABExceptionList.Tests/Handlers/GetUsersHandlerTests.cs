using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.ABExceptionList.Models;
using TicketVoidingSystem.ABExceptionList.Services;
using Xunit;

namespace TicketVoidingSystem.ABExceptionList.Tests.Handlers;

public class GetUsersHandlerTests
{
    [Fact()]
    public async Task Handler_RepositoryHasCalled_ReturnResult()
    {
        // Arrange
        var criteria = new GetUsersCriteria { Level = "", Sites = "", InvalidUsername = "", SubTypes = "", UserName = "", VoidVIP = "" };
        criteria.GetSettingKey();
        criteria.IsValid();
        var request = new GetUsersRequest { UserName = "aaa" };
        // Jacob. Expect empty thì tốt hơn
        var expectedResult = new List<UserModel>();
        var getUsersService = Substitute.For<GetUsersService>();
        getUsersService.GetUsers(Arg.Any<GetUsersRequest>()).ReturnsForAnyArgs(expectedResult);
        var handler = new GetUsersHandler(getUsersService);

        // Act
        var actualResult = await handler.Handle(request, default);

        // Assert
        await getUsersService.Received(1).GetUsers(Arg.Compat.Is<GetUsersRequest>(x => x.UserName == request.UserName));
        Assert.Equal(expectedResult, actualResult.Users);
    }
}