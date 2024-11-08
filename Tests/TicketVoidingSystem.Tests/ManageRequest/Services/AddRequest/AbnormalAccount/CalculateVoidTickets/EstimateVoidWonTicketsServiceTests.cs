using System.Collections.Generic;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public class EstimateVoidWonTicketsServiceTests : IClassFixture<AppSettingFixture>
{
    [Fact]
    public void Execute_ReturnEmptyListOfTicketCalculateWinLostAccount()
    {
        // Arrange
        var wonTickets = new OrderedTickets
        {
            Descending = new List<TicketCalculateWinLostAccount>
            {
                new() { WinLost = 100, BetId = 1 },
                new() { WinLost = 50, BetId = 2 }
            },
            TotalWinLost = 10
        };
        var loseTickets = new OrderedTickets
        {
            Descending = new List<TicketCalculateWinLostAccount>
            {
                new() { WinLost = 1, BetId = 1 },
                new() { WinLost = 2, BetId = 2 }
            },
            TotalWinLost = 20
        };

        var service = new EstimateVoidWonTicketsServiceImp(null, null);

        // Act
        var actual = service.Execute(wonTickets, loseTickets, 0);

        // Assert
        Assert.Empty(actual);
    }

    [Fact]
    public void Execute_ReturnTicketListBySortAlgorithm()
    {
        // Arrange
        var expected = new List<TicketCalculateWinLostAccount>
        {
            new() { WinLost = 999, BetId = 1 }
        };
        var wonTickets = new OrderedTickets
        {
            Descending = new List<TicketCalculateWinLostAccount>
            {
                new() { WinLost = 100, BetId = 1 },
                new() { WinLost = 50, BetId = 2 }
            },
            TotalWinLost = 10
        };
        var loseTickets = new OrderedTickets
        {
            Descending = new List<TicketCalculateWinLostAccount>
            {
                new() { WinLost = 1, BetId = 1 },
                new() { WinLost = 2, BetId = 2 }
            },
            TotalWinLost = 20
        };

        var knapsackAlgorithmService = Substitute.For<KnapsackAlgorithmService>();
        var sortAlgorithmService = Substitute.For<SortAlgorithmService>();
        knapsackAlgorithmService.Execute(null, 1).ReturnsForAnyArgs(expected);
        sortAlgorithmService.Execute(null, 1).ReturnsForAnyArgs(expected);
        var service = new EstimateVoidWonTicketsServiceImp(knapsackAlgorithmService, sortAlgorithmService);
        AppSettingService.AppSetting.IsUseKnapsackAlgorithm = false;

        // Act
        var actual = service.Execute(wonTickets, loseTickets, 10000);

        // Assert
        AssertExtension.Equal(expected, actual);
        sortAlgorithmService.Received(1).Execute(Arg.Any<OrderedTickets>(), Arg.Any<decimal>());
    }

    [Fact]
    public void Execute_ReturnTicketListByKnapsackAlgorithm()
    {
        // Arrange
        var expected = new List<TicketCalculateWinLostAccount>
        {
            new() { WinLost = 999, BetId = 1 }
        };
        var wonTickets = new OrderedTickets
        {
            Descending = new List<TicketCalculateWinLostAccount>
            {
                new() { WinLost = 100, BetId = 1 },
                new() { WinLost = 50, BetId = 2 }
            },
            TotalWinLost = 10
        };
        var loseTickets = new OrderedTickets
        {
            Descending = new List<TicketCalculateWinLostAccount>
            {
                new() { WinLost = 1, BetId = 1 },
                new() { WinLost = 2, BetId = 2 }
            },
            TotalWinLost = 20
        };

        var knapsackAlgorithmService = Substitute.For<KnapsackAlgorithmService>();
        var sortAlgorithmService = Substitute.For<SortAlgorithmService>();
        knapsackAlgorithmService.Execute(null, 1).ReturnsForAnyArgs(expected);
        sortAlgorithmService.Execute(null, 1).ReturnsForAnyArgs(expected);
        var service = new EstimateVoidWonTicketsServiceImp(knapsackAlgorithmService, sortAlgorithmService);
        AppSettingService.AppSetting.IsUseKnapsackAlgorithm = true;

        // Act
        var actual = service.Execute(wonTickets, loseTickets, 10000);

        // Assert
        AssertExtension.Equal(expected, actual);
        knapsackAlgorithmService.Received(1).Execute(Arg.Any<OrderedTickets>(), Arg.Any<decimal>());
    }
}