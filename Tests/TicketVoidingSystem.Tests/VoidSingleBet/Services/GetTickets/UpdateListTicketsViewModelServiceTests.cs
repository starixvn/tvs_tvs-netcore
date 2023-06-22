using System.Collections.Generic;
using Fanex.BetList.Core.Entities;
using NSubstitute;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using TicketVoidingSystem.VoidSingleBet.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Services.GetTickets;

public class UpdateListTicketsViewModelServiceTests
{
    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void Update_ValidParams_ModelHasUpdated(bool isMixParlay)
    {
        // Arrange
        var listTicketsViewModel = new ListTicketsViewModel();
        var tickets = new List<GetTicketModel>
        {
            new() { LicenseeName = "12BET", IsInstantSettlement = true, IsDeposit = true, IsMixParlay = isMixParlay, IsChinaView = false },
            new() { LicenseeName = "12BET", IsCashOut = true, IsDeposit = true, IsMixParlay = isMixParlay, IsChinaView = true },
            new() { LicenseeName = "12BET", IsCashOut = true, IsDeposit = false, IsMixParlay = isMixParlay, IsChinaView = true }
        };
        var betListService = Substitute.For<BetListService>();
        var service = new UpdateListTicketsViewModelServiceImp(TestSetup.CreateMapper(), betListService);

        // Act
        service.Update(listTicketsViewModel, tickets);

        // Assert
        Assert.NotNull(listTicketsViewModel);
        betListService.Received().GetBetTypeName(Arg.Any<Ticket>());
    }

    [Fact]
    public void Update_HaveNotAnyTickets_BetListServiceHasNotCalled()
    {
        // Arrange
        var listTicketsViewModel = new ListTicketsViewModel();
        var betListService = Substitute.For<BetListService>();
        var service = new UpdateListTicketsViewModelServiceImp(TestSetup.CreateMapper(), betListService);

        // Act
        service.Update(listTicketsViewModel, new List<GetTicketModel>());

        // Assert
        Assert.NotNull(listTicketsViewModel);
        betListService.Received(0).GetBetTypeName(Arg.Any<Ticket>());
    }
}