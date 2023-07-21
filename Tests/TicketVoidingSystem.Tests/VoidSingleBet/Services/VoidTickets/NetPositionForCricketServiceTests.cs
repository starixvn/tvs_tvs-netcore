using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.NetPosition;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.VoidTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Services.VoidTickets;

public class NetPositionForCricketServiceTests
{
    private readonly NetPositionService netPositionService;
    private readonly NetPositionForCricketServiceImp service;

    public NetPositionForCricketServiceTests()
    {
        netPositionService = Substitute.For<NetPositionService>();
        service = new NetPositionForCricketServiceImp(netPositionService);
    }

    [Fact]
    public async Task Update_CallUpdateNetPositionSuccessful_ReturnEmptyWarningCricket()
    {
        // Arrange
        netPositionService.UpdateNetPosition(default, default).ReturnsForAnyArgs(true);
        var tickets = new List<BetId> { new() { TransId = "1" } };
        var query = new VoidTicketsQuery { Tickets = tickets };

        // Act
        var (WarningCricket, TicketsAfterUpdateNp) = await service.Update(query);

        // Assert
        Assert.Empty(WarningCricket);
        AssertExtension.Equal(tickets, TicketsAfterUpdateNp);
    }

    [Fact]
    public async Task Update_CallUpdateNetPositionFailed_ReturnWarningCricket()
    {
        // Arrange
        var tickets = new List<BetId> { new() { TransId = "1" }, new() { TransId = "2" } };
        var ticketCrickets = new List<BetId> { new() { TransId = "123", SiteDbGroupId = 0 } };
        var query = new VoidTicketsQuery
        {
            TransIdCrickets = ticketCrickets,
            Tickets = tickets
        };
        var expectedTickets = new List<BetId> { new() { TransId = "1" }, new() { TransId = "2" } };
        netPositionService.UpdateNetPosition(default, default).ReturnsForAnyArgs(false);

        // Act
        var (WarningCricket, TicketsAfterUpdateNp) = await service.Update(query);

        // Assert
        Assert.NotEmpty(WarningCricket);
        AssertExtension.Equal(expectedTickets, TicketsAfterUpdateNp);
    }

    [Fact]
    public async Task Rollback_IsNeedToRollBackNetPositionTrue_RollBackNetPositionHasCalled()
    {
        // Arrange
        var voidResult = new VoidTicketsModel
        {
            IsNeedToRollBackNetPosition = true,
            Validation = new VoidTicketValidation()
        };
        var ticketCrickets = new List<BetId>();
        netPositionService.UpdateNetPosition(default, default).ReturnsForAnyArgs(false);

        // Act
        await service.Rollback(ticketCrickets, voidResult);

        // Assert
        await netPositionService.Received(1)
            .RollBackNetPosition(Arg.Any<IEnumerable<BetId>>());
    }

    [Fact]
    public async Task Rollback_IsNeedToRollBackNetPositionFalse_RollBackNetPositionHasCalled()
    {
        // Arrange
        var voidResult = new VoidTicketsModel
        {
            IsNeedToRollBackNetPosition = false
        };
        netPositionService.UpdateNetPosition(default, default).ReturnsForAnyArgs(false);
        var ticketCrickets = new List<BetId>();

        // Act
        await service.Rollback(ticketCrickets, voidResult);

        // Assert
        await netPositionService.Received(0)
            .RollBackNetPosition(Arg.Any<IEnumerable<BetId>>());
    }
}