using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.SharedApi.Handlers.MatchInfo;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.MatchInfo;

public class GetMatchInfoHandlerTests
{
    private readonly BetListService betListService;
    private readonly MatchService matchService;
    private readonly GetMatchInfoHandler handler;

    public GetMatchInfoHandlerTests()
    {
        betListService = Substitute.For<BetListService>();
        matchService = Substitute.For<MatchService>();
        handler = new GetMatchInfoHandler(betListService, matchService);
    }

    [Fact]
    public async Task Handle_Returns_Match()
    {
        // Arrange
        var request = new GetMatchInfoRequest();
        var expectedMatch = new Match();
        matchService.GetMatch(Arg.Any<GetMatchInfoRequest>()).ReturnsForAnyArgs(expectedMatch);
        matchService.UpdateMatchInfoFromRemotingRef(Arg.Any<Match>()).ReturnsForAnyArgs(expectedMatch);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectedMatch, result);
    }

    [Fact]
    public async Task Handle_Returns_ExpectedMatch()
    {
        // Arrange
        var request = new GetMatchInfoRequest();
        var expectedMatch = new Match { MatchCode = "ABC", SportType = 190 };
        matchService.GetMatch(Arg.Any<GetMatchInfoRequest>()).ReturnsForAnyArgs(expectedMatch);
        matchService.UpdateMatchInfoFromRemotingRef(Arg.Any<Match>()).ReturnsForAnyArgs(expectedMatch);
        betListService.GetMatchCodeBetradar(Arg.Any<string>()).ReturnsForAnyArgs("XYZ");

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("XYZ", result.MatchCode);
    }

    [Fact]
    public async Task Handle_ReturnsNull_WhenMatchNull()
    {
        // Arrange
        var request = new GetMatchInfoRequest();
        matchService.GetMatch(Arg.Any<GetMatchInfoRequest>()).ReturnsForAnyArgs((Match)null);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Null(result);
    }
}