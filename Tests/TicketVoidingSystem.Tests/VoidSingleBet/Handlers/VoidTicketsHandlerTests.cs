using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeHybridParlay;
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
        netPositionForCricketService.Update(null).ReturnsForAnyArgs(("", new List<BetId>()));
        var handler = new VoidTicketsHandler(voidResultCacheService, netPositionForCricketService, null, null);

        // Act
        var actual = await handler.Handle(new VoidTicketsRequest
        {
            Tickets = new List<BetId>(),
            TransIdCrickets = new List<BetId>()
        }, CancellationToken.None);

        // Assert
        await voidResultCacheService.ReceivedWithAnyArgs(2).SetVoidResultsCache(null, null);
        var iEnumerable = actual.ToList();
        Assert.Single(iEnumerable);
        Assert.Equal(ErrorCode.ExecuteQueryAPIFail, iEnumerable.First().ErrorCode);
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
        netPositionForCricketService.Update(null).ReturnsForAnyArgs(("", new List<BetId> { new() }));
        afterVoidService.ExecuteWhenVoidSuccess(null, null, null)
            .ReturnsForAnyArgs(new List<Result> { new() { ErrorCode = 0 } });
        afterVoidService.ExecuteWhenVoidFailed(null)
            .ReturnsForAnyArgs(new List<Result> { new() { ErrorCode = 1 } });
        var hybridParlayTicketService = Substitute.For<HybridParlayTicketService>();
        hybridParlayTicketService.Execute(Arg.Any<IEnumerable<BetId>>(), Arg.Any<HybridParlayType>(), Arg.Any<int>(), Arg.Any<int>())
            .ReturnsForAnyArgs(Task.FromResult(false));
        voidTicketsService.VoidBet(Arg.Any<VoidTicketsQuery>()).Returns(new VoidTicketsModel());
        var handler = new VoidTicketsHandler(voidResultCacheService, netPositionForCricketService, voidTicketsService, afterVoidService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await voidResultCacheService.ReceivedWithAnyArgs(2).SetVoidResultsCache(null, null);
        await netPositionForCricketService.ReceivedWithAnyArgs(1).Rollback(Arg.Any<VoidTicketsModel>());
        await voidTicketsService.ReceivedWithAnyArgs(1).VoidBet(Arg.Any<VoidTicketsQuery>());
        Assert.Equal(2, actual.Count());
    }
}