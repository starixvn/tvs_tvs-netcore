using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ABExceptionList.Handlers;

public class AddUsersHandlerTests
{
    [Fact]
    public async Task Handler_ValidQuery_RepositoryHasCalledExecuteAsync()
    {
        // Arrange
        var request = new AddUsersRequest();
        var repository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var handler = new AddUsersHandler(repository, sessionService);

        // Act
        _ = await handler.Handle(request, default);

        // Assert
        await repository.Received(1).ExecuteAsync(Arg.Any<AddUsersCommand>(), default);
    }
}