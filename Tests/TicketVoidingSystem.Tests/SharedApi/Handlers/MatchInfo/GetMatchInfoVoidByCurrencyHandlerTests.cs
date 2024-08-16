using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.SharedApi.Handlers.MatchInfo;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.MatchInfo;

public class GetMatchInfoVoidByCurrencyHandlerTests
{
    private readonly BetListService betListService = Substitute.For<BetListService>();
    private readonly MatchService matchService = Substitute.For<MatchService>();
    private GetMatchInfoVoidByCurrencyHandler handler;

    [Fact]
    public async Task Handle_HasMatchIsNull_NotCalledGetMatchCodeBetradar()
    {
        // Arrange
        matchService.GetMatchVoidByCurrency(Arg.Any<GetMatchInfoVoidByCurrencyRequest>()).Returns((Match)null);
        matchService.UpdateMatchInfoFromRemotingRef(null).Returns((Match)null);

        handler = new GetMatchInfoVoidByCurrencyHandler(betListService, matchService);

        // Act
        _ = await handler.Handle(null, CancellationToken.None);

        // Assert
        await matchService.Received(1).GetMatchVoidByCurrency(Arg.Any<GetMatchInfoVoidByCurrencyRequest>());
        matchService.Received(1).UpdateMatchInfoFromRemotingRef(null);
    }

    [Fact]
    public async Task Handle_HasSportTypeNotIsVirtualSport_NotCalledGetMatchCodeBetradar()
    {
        // Arrange
        var match = new Match { SportType = 0 };
        matchService.GetMatchVoidByCurrency(Arg.Any<GetMatchInfoVoidByCurrencyRequest>()).Returns(match);
        matchService.UpdateMatchInfoFromRemotingRef(null).Returns(match);

        handler = new GetMatchInfoVoidByCurrencyHandler(betListService, matchService);

        // Act
        _ = await handler.Handle(null, CancellationToken.None);

        // Assert
        betListService.Received(0).GetVirtualSportMatchCode(147, Arg.Any<string>());
    }

    [Fact]
    public async Task Handle_HasSportTypeIsVirtualSport_NotCalledGetMatchCodeBetradar()
    {
        // Arrange
        var match = new Match { SportType = 190 };
        matchService.GetMatchVoidByCurrency(Arg.Any<GetMatchInfoVoidByCurrencyRequest>()).Returns(match);
        matchService.UpdateMatchInfoFromRemotingRef(Arg.Any<Match>()).Returns(match);
        betListService.GetVirtualSportMatchCode(190, match.MatchCode).Returns("1");
        handler = new GetMatchInfoVoidByCurrencyHandler(betListService, matchService);

        // Act
        var result = await handler.Handle(null, CancellationToken.None);

        // Assert
        betListService.Received(1).GetVirtualSportMatchCode(190, Arg.Any<string>());
        Assert.Equal("1", result.MatchCode);
    }
}