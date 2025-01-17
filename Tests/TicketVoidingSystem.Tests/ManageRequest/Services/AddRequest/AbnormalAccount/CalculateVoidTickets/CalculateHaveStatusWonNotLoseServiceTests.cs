using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public class CalculateHaveStatusWonNotLoseServiceTests : IClassFixture<AppSettingFixture>
{
    private readonly CombineVoidTicketsService combineVoidTicketsService = Substitute.For<CombineVoidTicketsService>();
    private readonly EstimateVoidWonTicketsService estimateVoidWonTicketsService = Substitute.For<EstimateVoidWonTicketsService>();
    private CalculateHaveStatusWonNotLoseServiceImp service;

    [Fact]
    public async Task ExecuteParallel_ValidRequest_ReturnResultExpected()
    {
        // Arrange
        service = new CalculateHaveStatusWonNotLoseServiceImp(estimateVoidWonTicketsService, combineVoidTicketsService);
        var orderedAccounts = new List<AccountWinlostModel>
        {
            new() { CustId = 1, AdjustVoidLimit = 40 },
            new() { CustId = 2 }
        };
        var ticketStatusIds = new List<int> { 1 };
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
        var voidWonTickets = new List<TicketCalculateWinLostAccount> { new() { WinLost = 100, CustId = 1, BetId = 1 } };
        estimateVoidWonTicketsService.Execute(Arg.Any<OrderedTickets>(), Arg.Any<OrderedTickets>(),
            Arg.Any<decimal>()).ReturnsForAnyArgs(voidWonTickets);
        var othersVoidTickets = new List<TicketCalculateWinLostAccount>
            { new() { WinLost = 100, CustId = 1, BetId = 3 } };
        combineVoidTicketsService.Execute(1, Arg.Any<IEnumerable<int>>(),
            Arg.Any<Dictionary<(int CustId, int StatusId), OrderedTickets>>()).Returns(othersVoidTickets);
        var voidTicketsWithCustId2 = new List<TicketCalculateWinLostAccount>();
        combineVoidTicketsService.Execute(2, Arg.Any<IEnumerable<int>>(),
                Arg.Any<Dictionary<(int CustId, int StatusId), OrderedTickets>>())
            .Returns(voidTicketsWithCustId2);
        var voidTickets = voidWonTickets.Concat(othersVoidTickets);
        var expected = new CalcVoidTicketsResult
        {
            VoidTickets = new List<TicketCalculateWinLostAccount>
            {
                new() { WinLost = 100, CustId = 1, BetId = 1 },
                new() { WinLost = 100, CustId = 1, BetId = 3 }
            },
            Accounts = new List<AccountWinlostModel>
            {
                new()
                {
                    IsHighlight = true, CurrentLosing = -100, CurrentWinning = 150, AdjustVoidLimit = 40,
                    EstimateVoidAmount = 100, EstimateVoidAmountUnEditableTickets = 100, WinLostAfterVoid = -50, VoidTickets = voidTickets, CustId = 1
                },
                new()
                {
                    IsHighlight = false,
                    CustId = 2,
                    CurrentLosing = 0,
                    CurrentWinning = 0,
                    EstimateVoidAmount = 0,
                    EstimateVoidAmountUnEditableTickets = 0,
                    WinLostAfterVoid = 0,
                    VoidTickets = voidTicketsWithCustId2
                }
            }
        };

        // Act
        var actual = await service.ExecuteParallel(orderedAccounts, groupTickets, ticketStatusIds);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}