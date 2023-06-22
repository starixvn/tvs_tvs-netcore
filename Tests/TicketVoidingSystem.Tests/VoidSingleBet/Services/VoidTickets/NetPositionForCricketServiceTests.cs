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
    [Fact]
    public async Task Update_CallApiSuccessful_ReturnEmptyWarningCricket()
    {
        // Arrange
        var netPositionService = Substitute.For<NetPositionService>();
        netPositionService.UpdateNetPosition(default, default).ReturnsForAnyArgs(true);
        var service = new NetPositionForCricketServiceImp(netPositionService);

        // Act
        var actual = await service.Update(new VoidTicketsQuery());

        // Assert
        Assert.Empty(actual.WarningCricket);
    }

    [Fact]
    public async Task Update_CallApiFailed_ReturnWarningCricket()
    {
        // Arrange
        var query = new VoidTicketsQuery
        {
            TransIdCrickets = "1",
            Tickets = new List<BetId> { new() }
        };
        var netPositionService = Substitute.For<NetPositionService>();
        netPositionService.UpdateNetPosition(default, default).ReturnsForAnyArgs(false);
        var service = new NetPositionForCricketServiceImp(netPositionService);

        // Act
        var actual = await service.Update(query);

        // Assert
        Assert.NotEmpty(actual.WarningCricket);
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
        var netPositionService = Substitute.For<NetPositionService>();
        netPositionService.UpdateNetPosition(default, default).ReturnsForAnyArgs(false);
        var service = new NetPositionForCricketServiceImp(netPositionService);

        // Act
        await service.Rollback("", voidResult);

        // Assert
        await netPositionService.Received(1)
            .RollBackNetPosition(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>());
    }

    [Fact]
    public async Task Rollback_IsNeedToRollBackNetPositionFalse_RollBackNetPositionHasCalled()
    {
        // Arrange
        var voidResult = new VoidTicketsModel
        {
            IsNeedToRollBackNetPosition = false
        };
        var netPositionService = Substitute.For<NetPositionService>();
        netPositionService.UpdateNetPosition(default, default).ReturnsForAnyArgs(false);
        var service = new NetPositionForCricketServiceImp(netPositionService);

        // Act
        await service.Rollback("", voidResult);

        // Assert
        await netPositionService.Received(0)
            .RollBackNetPosition(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>());
    }
}