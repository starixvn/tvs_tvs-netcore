using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Handlers;
using TicketVoidingSystem.VoidSingleBet.Services.VoidTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Handlers;

public class VoidTicketsHandlerTests
{
    [Fact]
    public async Task Handler_HaveNotTicketCanBeVoid_CreateMessageFailApiCricket()
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
        var voidResultCacheService = Substitute.For<VoidResultCacheService>();
        voidResultCacheService.IsExistVoidResult(Arg.Compat.Any<string>()).ReturnsForAnyArgs(false);
        netPositionForCricketService.Update(default!).ReturnsForAnyArgs(("", new List<BetId>()));
        var handler = new VoidTicketsHandler(
            voidResultCacheService,
            netPositionForCricketService,
            voidTicketsService,
            afterVoidService);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await netPositionForCricketService.Received().Update(Arg.Any<VoidTicketsQuery>());
    }

    [Fact]
    public async Task Handler_HaveTicketCanBeVoid_CreateMessageFailApiCricket()
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
        var voidResultCacheService = Substitute.For<VoidResultCacheService>();
        voidResultCacheService.IsExistVoidResult(Arg.Compat.Any<string>()).ReturnsForAnyArgs(false);
        netPositionForCricketService.Update(default!).ReturnsForAnyArgs(("", new List<BetId> { new() }));
        var handler = new VoidTicketsHandler(
            voidResultCacheService,
            netPositionForCricketService,
            voidTicketsService,
            afterVoidService);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await netPositionForCricketService.Received().Update(Arg.Any<VoidTicketsQuery>());
    }

    [Fact]
    public async Task Handler_IsExistVoidResult_NotCallSetVoidResultCache()
    {
        // Arrange
        var ticketCrickets = new List<BetId> { new() { TransId = "123", SiteDbGroupId = 0 } };
        var request = new VoidTicketsRequest
        {
            Tickets = new List<BetId> { new() },
            TransIdCrickets = ticketCrickets,
            UserPassword = string.Empty
        };
        var voidResultCacheService = Substitute.For<VoidResultCacheService>();
        voidResultCacheService.IsExistVoidResult(Arg.Compat.Any<string>()).ReturnsForAnyArgs(true);
        var handler = new VoidTicketsHandler(voidResultCacheService, null!, null!, null!);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await voidResultCacheService.Received(0).SetVoidResultCache(Arg.Any<string>(), Arg.Any<List<Result>>());
    }
}