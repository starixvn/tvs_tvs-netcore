using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Handlers;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.VoidTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Handlers;

public class VoidTicketsHandlerTests
{
    [Fact]
    public async Task Handler_IsExistVoidResultCache_NotCallSetVoidResultCache()
    {
        // Arrange
        var ticketCrickets = new List<BetId> { new() { TransId = "123", SiteDbGroupId = 0 } };
        var request = new VoidTicketsRequest
        {
            Tickets = new List<BetId> { new() },
            TransIdCrickets = ticketCrickets,
            UserPassword = string.Empty
        };
        var voidResultCacheService = Substitute.For<ResultCacheService>();
        voidResultCacheService.IsExistResult(Arg.Any<string>()).ReturnsForAnyArgs(true);
        var handler = new VoidTicketsHandler(voidResultCacheService, null!, null!, null!);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await voidResultCacheService.DidNotReceiveWithAnyArgs().SetVoidResultsCache(Arg.Any<string>(), Arg.Any<List<Result>>());
    }

    [Fact]
    public async Task Handler_NotHaveTicketCanBeVoid_ReturnMessageFailApiCricket()
    {
        // Arrange
        var netPositionForCricketService = Substitute.For<NetPositionForCricketService>();
        var voidResultCacheService = Substitute.For<ResultCacheService>();
        voidResultCacheService.IsExistResult(Arg.Compat.Any<string>()).ReturnsForAnyArgs(false);
        netPositionForCricketService.Update(default).ReturnsForAnyArgs(("", new List<BetId>()));
        var handler = new VoidTicketsHandler(voidResultCacheService, netPositionForCricketService, default, default);

        // Act
        var actual = await handler.Handle(new VoidTicketsRequest(), CancellationToken.None);

        // Assert
        await voidResultCacheService.ReceivedWithAnyArgs(2).SetVoidResultsCache(default, default);
        Assert.Single(actual);
        Assert.Equal(ErrorCode.ExecuteQueryAPIFail, actual.First().ErrorCode);
    }

    [Fact]
    public async Task Handler_HaveTicketsCanBeVoid_ReturnListMessagesResult()
    {
        // Arrange
        var ticketCrickets = new List<BetId> { new() { TransId = "123", SiteDbGroupId = 0 } };
        var request = new VoidTicketsRequest
        {
            Tickets = new List<BetId> { new() },
            TransIdCrickets = ticketCrickets,
            UserPassword = string.Empty
        };
        var voidTicketsService = Substitute.For<VoidTicketsService>();
        var netPositionForCricketService = Substitute.For<NetPositionForCricketService>();
        var afterVoidService = Substitute.For<AfterVoidService>();
        var voidResultCacheService = Substitute.For<ResultCacheService>();
        voidResultCacheService.IsExistResult(Arg.Any<string>()).ReturnsForAnyArgs(false);
        netPositionForCricketService.Update(default).ReturnsForAnyArgs(("", new List<BetId> { new() }));
        afterVoidService.ExecuteWhenVoidSuccess(default, default, default)
            .ReturnsForAnyArgs(new List<Result> { new() { ErrorCode = 0 } });
        afterVoidService.ExecuteWhenVoidFailed(default)
            .ReturnsForAnyArgs(new List<Result> { new() { ErrorCode = 1 } });
        var handler = new VoidTicketsHandler(voidResultCacheService, netPositionForCricketService, voidTicketsService, afterVoidService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await voidResultCacheService.ReceivedWithAnyArgs(2).SetVoidResultsCache(default, default);
        await netPositionForCricketService.ReceivedWithAnyArgs(1).Rollback(Arg.Any<VoidTicketsModel>());
        await voidTicketsService.ReceivedWithAnyArgs(1).VoidBet(Arg.Any<VoidTicketsQuery>());
        Assert.Equal(2, actual.Count());
    }
}