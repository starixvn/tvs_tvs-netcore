using NSubstitute;
using System.Collections.Generic;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;
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

        var service = new EstimateVoidWonTicketsServiceImp(null);

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

        var sortAlgorithmService = Substitute.For<SortAlgorithmService>();
        sortAlgorithmService.Execute(null, 1).ReturnsForAnyArgs(expected);
        var service = new EstimateVoidWonTicketsServiceImp(sortAlgorithmService);

        // Act
        var actual = service.Execute(wonTickets, loseTickets, 10000);

        // Assert
        AssertExtension.Equal(expected, actual);
        sortAlgorithmService.Received(1).Execute(Arg.Any<OrderedTickets>(), Arg.Any<decimal>());
    }
}