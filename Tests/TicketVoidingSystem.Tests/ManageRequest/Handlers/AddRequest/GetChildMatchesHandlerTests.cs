using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class GetChildMatchesHandlerTests
{
    private readonly GetChildMatchesHandler handler;
    private readonly MatchInfoAddRequestService matchInfoAddRequestService;
    private readonly IDynamicRepository repository;

    public GetChildMatchesHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        matchInfoAddRequestService = Substitute.For<MatchInfoAddRequestService>();
        handler = new GetChildMatchesHandler(repository, matchInfoAddRequestService);
    }

    [Fact]
    public async Task Handler_Always_CalledExpected()
    {
        // Arrange
        repository.FetchAsync<MatchInfoAddRequest>(Arg.Any<GetChildMatchesRequest>(), CancellationToken.None)
            .ReturnsForAnyArgs(new List<MatchInfoAddRequest>());
        matchInfoAddRequestService.UpdateDataFromRemotingRef(Arg.Any<IEnumerable<MatchInfoAddRequest>>())
            .ReturnsForAnyArgs(new List<MatchInfoAddRequest>());

        // Act
        _ = await handler.Handle(null, CancellationToken.None);

        // Assert
        await repository.Received(1)
            .FetchAsync<MatchInfoAddRequest>(Arg.Any<GetChildMatchesRequest>(), CancellationToken.None);
        matchInfoAddRequestService.Received(1)
            .UpdateDataFromRemotingRef(Arg.Any<IEnumerable<MatchInfoAddRequest>>());
    }
}