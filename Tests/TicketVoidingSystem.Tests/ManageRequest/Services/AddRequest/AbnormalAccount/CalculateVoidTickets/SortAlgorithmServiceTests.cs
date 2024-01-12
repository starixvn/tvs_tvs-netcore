using System.Collections.Generic;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public class SortAlgorithmServiceTests
{
    [Fact]
    public void Execute_ReturnVoidTickets()
    {
        // Arrange
        var expected = new List<TicketCalculateWinLostAccount>
        {
            new() { WinLost = 10, BetId = 2 },
            new() { WinLost = 20, BetId = 2 },
            new() { WinLost = 30, BetId = 2 }
        };
        var wonTickets = new OrderedTickets
        {
            Descending = new List<TicketCalculateWinLostAccount>
            {
                new() { WinLost = 10, BetId = 2 },
                new() { WinLost = 20, BetId = 2 },
                new() { WinLost = 30, BetId = 2 },
                new() { WinLost = 40, BetId = 2 },
                new() { WinLost = 50, BetId = 2 }
            },
            TotalWinLost = 150
        };
        var service = new SortAlgorithmServiceImp();

        // Act
        var actual = service.Execute(wonTickets, 100);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public void Execute_ReturnEmptyWhenVoidLimitSmallerAllWinlost()
    {
        // Arrange
        var wonTickets = new OrderedTickets
        {
            Descending = new List<TicketCalculateWinLostAccount>
            {
                new() { WinLost = 10, BetId = 2 },
                new() { WinLost = 20, BetId = 2 },
                new() { WinLost = 30, BetId = 2 },
                new() { WinLost = 40, BetId = 2 },
                new() { WinLost = 50, BetId = 2 }
            },
            TotalWinLost = 150
        };
        var service = new SortAlgorithmServiceImp();

        // Act
        var actual = service.Execute(wonTickets, 10);

        // Assert
        Assert.Empty(actual);
    }
}