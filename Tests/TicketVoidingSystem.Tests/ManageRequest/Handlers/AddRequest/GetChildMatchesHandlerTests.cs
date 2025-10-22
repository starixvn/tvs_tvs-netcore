using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class GetChildMatchesHandlerTests
{
    private readonly GetChildMatchesHandler handler;
    private readonly IDynamicRepository repository;

    public GetChildMatchesHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        var matchService1 = Substitute.For<MatchService>();
        handler = new GetChildMatchesHandler(repository, matchService1);
    }

    [Fact]
    public async Task Handler_Always_CalledExpected()
    {
        // Arrange
        repository.FetchAsync<Match>(Arg.Any<GetChildMatchesRequest>()).ReturnsForAnyArgs(new List<Match>());

        // Act
        _ = await handler.Handle(null, CancellationToken.None);

        // Assert
        await repository.Received(1).FetchAsync<Match>(Arg.Any<GetChildMatchesRequest>());
    }
}