using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ABExceptionList.Handlers;

public class RemoveUsersHandlerTests
{
    [Fact]
    public async Task Handler_ValidQuery_RepositoryHasCalledExecuteAsync()
    {
        // Arrange
        var request = new RemoveUsersRequest();
        var repository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var handler = new RemoveUsersHandler(repository, sessionService);

        // Act
        _ = await handler.Handle(request, CancellationToken.None);

        // Assert
        await repository.Received(1).ExecuteAsync(Arg.Any<RemoveUsersCommand>());
    }
}