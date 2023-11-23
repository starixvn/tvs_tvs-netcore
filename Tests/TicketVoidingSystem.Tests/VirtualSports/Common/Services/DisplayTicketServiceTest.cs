using NSubstitute;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.Common.Services;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Services.GetTickets;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.GetTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.Common.Services;


public class DisplayTicketServiceTest
{
    [Theory]
    [InlineData("RUNNING", "1000", "-")]
    [InlineData("waiting", "1000", "-")]
    [InlineData("WON", "1000", "1,000")]
    public void GetTicket_CheckStatusTicket_WinlostDisplayHyphenIfRunningOrWaiting(string status, string winlost, string expected)
    {
        // Arrange
        var item = new GetTicketModel { Status = status, WinLost = winlost };
        var voidBetListService = Substitute.For<VoidBetListService>();
        voidBetListService.Create(item).ReturnsForAnyArgs(new TicketViewModel());
        var recoverBetListService = Substitute.For<RecoverBetListService>();
        var service = new TicketServiceImp(voidBetListService, recoverBetListService);

        // Act
        var ticket = service.GetTicket(item);

        // Assert
        Assert.Equal(expected, ticket.WinLoss);
    }

    [Fact]
    public void GetTicket_Recover_CreateTicketViewModelWithTypeOfRecover()
    {
        // Arrange
        var expected = new TicketViewModel { Odds = "<span></span>" };
        var item = new GetTicketModel { Status = "Running" };
        const Recover typeOfRecover = Recover.MainParlay;
        var voidBetListService = Substitute.For<VoidBetListService>();
        var recoverBetListService = Substitute.For<RecoverBetListService>();
        recoverBetListService.Create(item, typeOfRecover).ReturnsForAnyArgs(expected);
        var service = new TicketServiceImp(voidBetListService, recoverBetListService);

        // Act
        var ticket = service.GetTicket(item, typeOfRecover);

        // Assert
        Assert.Equal(expected.Odds, ticket.Odds);
    }
}