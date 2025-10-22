using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public class CalculateRemainStatusServiceTests
{
    [Fact]
    public async Task ExecuteParallel_ReturnExpected()
    {
        // Arrange
        var orderedAccounts = new List<AccountWinlostModel>
        {
            new() { CustId = 1, AdjustVoidLimit = 40 },
            new() { CustId = 2 }
        };
        int[] ticketStatusIds = [1];
        var groupTickets = new Dictionary<(int CustId, int StatusId), OrderedTickets>
        {
            {
                (1, TicketStatus.WonId), new OrderedTickets
                {
                    TotalWinLost = 150, Descending = new List<TicketCalculateWinLostAccount>
                    {
                        new() { WinLost = 100, BetId = 1 },
                        new() { WinLost = 50, BetId = 2 }
                    }
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
        var voidWonTickets = new List<TicketCalculateWinLostAccount> { new() { WinLost = 100, CustId = 1, BetId = 3 } };
        var combineVoidTicketsService = Substitute.For<CombineVoidTicketsService>();
        combineVoidTicketsService.Execute(1, Arg.Any<IEnumerable<int>>(),
            Arg.Any<Dictionary<(int CustId, int StatusId), OrderedTickets>>()).Returns(voidWonTickets);
        var voidTicketsWithCustId2 = new List<TicketCalculateWinLostAccount>();
        combineVoidTicketsService.Execute(2, Arg.Any<IEnumerable<int>>(),
                Arg.Any<Dictionary<(int CustId, int StatusId), OrderedTickets>>()).Returns(voidTicketsWithCustId2);
        var expected = new CalcVoidTicketsResult
        {
            VoidTickets = new List<TicketCalculateWinLostAccount>
            {
                new() { WinLost = 100, CustId = 1, BetId = 3 }
            },
            Accounts = new List<AccountWinlostModel>
            {
                new()
                {
                    IsHighlight = false, CurrentLosing = -100, CurrentWinning = 150, AdjustVoidLimit = 40,
                    EstimateVoidAmount = 0, WinLostAfterVoid = 0, VoidTickets = voidWonTickets, CustId = 1
                },
                new()
                {
                    IsHighlight = false,
                    CustId = 2,
                    CurrentLosing = 0,
                    CurrentWinning = 0,
                    EstimateVoidAmount = 0,
                    WinLostAfterVoid = 0,
                    VoidTickets = voidTicketsWithCustId2
                }
            }
        };
        var service = new CalculateRemainStatusServiceImp(combineVoidTicketsService);

        // Act
        var actual = await service.ExecuteParallel(orderedAccounts, groupTickets, ticketStatusIds);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}