using NSubstitute;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.Services.GetTickets;
using SpecialDelete.NumberGame.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.NumberGame.Services.GetTickets;


public class TicketServiceTest
{
    [Theory]
    [InlineData("Running", true, "-")]
    [InlineData("WAITING", false, "-")]
    [InlineData("win", true, "9,000.12")]
    [InlineData("lose", false, "9,000.12<br>5.45")]
    public void GetWinLost_CheckStatusAndIsRecover_ReturnRightWinLost(string status, bool isRecover, string expected)
    {
        // Arrange
        var item = new GetTicketModel { Status = status, WinLost = "9000.123", Comm = 5.45m };
        var betListCoreService = Substitute.For<BetListCoreService>();
        betListCoreService.GetTicket(item, isRecover).ReturnsForAnyArgs(new TicketViewModel());
        var service = new TicketServiceImp(betListCoreService);

        // Act
        var viewModel = service.GetTicket(item, false, isRecover);

        // Assert
        Assert.Equal(expected, viewModel.WinLost);
    }
}