using System.Collections.Generic;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public class CombineVoidTicketsServiceTests
{
    [Fact]
    public void Execute_ReturnExpected()
    {
        // Arrange
        var ticketDescending = new List<TicketCalculateWinLostAccount>
        {
            new() { WinLost = 100, BetId = 1 },
            new() { WinLost = 50, BetId = 2 }
        };
        var groupTickets = new Dictionary<(int CustId, int StatusId), OrderedTickets>
        {
            {
                (1, TicketStatus.WonId), new OrderedTickets
                {
                    TotalWinLost = 150,
                    Descending = ticketDescending
                }
            },
            {
                (1, TicketStatus.LoseId), new OrderedTickets
                {
                    TotalWinLost = 100,
                    Descending = new List<TicketCalculateWinLostAccount>
                    {
                        new() { WinLost = 100, BetId = 3 }
                    }
                }
            }
        };
        var service = new CombineVoidTicketsServiceImp();

        // Act
        var actual = service.Execute(1, [112, 114], groupTickets);

        // Assert
        AssertExtension.Equal(ticketDescending, actual);
    }
}