using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.ABExceptionList.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ABExceptionList.Handlers;

public class CheckUsernamesHandlerTests
{
    [Fact]
    public async Task Handler_RepositoryHasCalled_ReturnResult()
    {
        // Arrange
        var criteria = new CheckUsernamesCriteria();
        criteria.GetSettingKey();
        criteria.IsValid();
        var request = new CheckUsernamesRequest { Usernames = "maria" };
        var expectedResult = new CheckUsernamesModel { ExistedUsernames = "ex", InvalidUsernames = "in" };
        var repository = Substitute.For<IDynamicRepository>();
        repository.GetAsync<CheckUsernamesModel>(Arg.Any<CheckUsernamesCriteria>()).ReturnsForAnyArgs(expectedResult);
        var handler = new CheckUsernamesHandler(repository);

        // Act
        var actualResult = await handler.Handle(request, default);

        // Assert
        await repository.Received(1).GetAsync<CheckUsernamesModel>(Arg.Is<CheckUsernamesCriteria>(x => x.Usernames == request.Usernames));
        Assert.Equal(expectedResult, actualResult);
    }
}