using System.Collections.Generic;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalAccount;

public class CompressDataAddRequestServiceTests
{
    [Fact]
    public void CompressTicket_ReturnExpected()
    {
        // Arrange
        var tickets = new List<TicketCalculateWinLostAccount>
        {
            new() { MatchId  = 1, TransId = 1, CustId =1, BetType=1, BetId = 1, IsMixParlay = true, SiteDbGroupId = 0, IsVoid14 = true}
        };
        var service = new CompressDataAddRequestServiceImp();

        // Act
        var actual = service.CompressTicket(tickets);

        // Assert
        Assert.NotNull(actual);
        Assert.StartsWith("0x", actual);
    }
}