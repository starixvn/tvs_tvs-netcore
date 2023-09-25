using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Handlers.MatchInfo;
using TicketVoidingSystem.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.MatchInfo;

public class GetMatchInfoForAddRequestTests
{
    private readonly GetMatchInfoAddRequestHandler handler;
    private readonly MatchService matchService;

    public GetMatchInfoForAddRequestTests()
    {
        matchService = Substitute.For<MatchService>();
        handler = new GetMatchInfoAddRequestHandler(matchService);
    }

    [Fact]
    public async Task Handle_HasRequest_HasCalledExpected()
    {
        // Arrange
        var request = new GetMatchInfoForAddRequest();
        matchService.GetMatchAddRequest(Arg.Any<GetMatchInfoForAddRequest>())
            .ReturnsForAnyArgs(new MatchInfoAddRequestViewModel());
        matchService.UpdateMatchInfoFromRemotingRef(Arg.Any<Match>()).ReturnsForAnyArgs(new Match());

        // Act
        _ = await handler.Handle(request, CancellationToken.None);

        // Assert
        await matchService.Received(1).GetMatchAddRequest(Arg.Any<GetMatchInfoForAddRequest>());
        matchService.Received(1).UpdateMatchInfoFromRemotingRef(Arg.Any<Match>());
    }
}