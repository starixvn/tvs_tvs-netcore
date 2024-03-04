using System.Collections.Generic;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
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

        const string expected = "0x1F8B080000000000000A8B66A8665062C865C8644801D2560C860C3A40BA04899D8CC44E02CA54321430A4A288A1" +
                                "EACD6428660800F34B188A184A816A41A2C540F112203B05A81E246700571B06D46782A2BE9621960100E202B87098000000";
        var service = new CompressDataAddRequestServiceImp();

        // Act
        var actual = service.CompressTicket(tickets);

        // Assert
        Assert.Equal(expected, actual);
    }
}