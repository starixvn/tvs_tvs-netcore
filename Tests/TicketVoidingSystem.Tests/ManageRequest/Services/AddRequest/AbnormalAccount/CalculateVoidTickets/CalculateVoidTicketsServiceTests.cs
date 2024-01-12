using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public class CalculateVoidTicketsServiceTests
{
    [Theory]
    [InlineData("112")]
    [InlineData("112, 113")]
    public async Task ExecuteForAbnormalAccountWithPolicy_ReturnExpected(string statusIds)
    {
        // Arrange
        var tickets = new List<TicketCalculateWinLostAccount>
        {
            new() { CustId = 1 },
            new() { CustId = 2 }
        };
        var accounts = new List<AccountWinlostModel>
        {
            new() { Username = "user1" },
            new() { Username = "user2" }
        };
        var result = new CalcVoidTicketsResult { VoidTickets = new List<TicketCalculateWinLostAccount> { new() } };
        var combineVoidTicketsService = Substitute.For<CalculateHaveStatusWonNotLoseService>();
        var calculateRemainStatusService = Substitute.For<CalculateRemainStatusService>();
        combineVoidTicketsService.ExecuteParallel(null, null, null).ReturnsForAnyArgs(result);
        calculateRemainStatusService.ExecuteParallel(null, null, null).ReturnsForAnyArgs(result);
        var service = new CalculateVoidTicketsServiceImp(combineVoidTicketsService, calculateRemainStatusService);

        // Act
        var actual = await service.ExecuteForAbnormalAccountWithPolicy(statusIds, tickets, accounts);

        // Assert
        AssertExtension.Equal(result, actual);
    }
}