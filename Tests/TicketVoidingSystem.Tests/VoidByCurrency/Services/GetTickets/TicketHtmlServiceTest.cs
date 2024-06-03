using System;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Services.GetTickets;
using SpecialDelete.VoidByCurrency.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Services.GetTickets;

public class TicketHtmlServiceTest
{
    [Theory]
    [InlineData(true, true)]
    [InlineData(false, false)]
    public void GetTicketDetail_HasUserPerMission_ReturnIsDisableWithPermission(bool isDisable, bool expected)
    {
        // Arrange
        var item = new GetTicketModel
        {
            IsSecondAcceptFlag = true,
            Status = string.Empty,
            TransDate = DateTimeOffset.Now.DateTime
        };
        var userPermission = new UserPermission { SettledTicket = true };
        var checkBoxService = Substitute.For<CheckBoxService>();
        checkBoxService.IsDisable(item, userPermission).ReturnsForAnyArgs(isDisable);
        var betListCoreService = Substitute.For<BetListCoreService>();
        betListCoreService.GetOutrightTicket(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new TicketViewModel());
        betListCoreService.GetTicket(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new TicketViewModel());
        var service = new TicketServiceImp(betListCoreService, checkBoxService);

        // Act
        var actual = service.GetTicketDetail(item, userPermission, true);

        // Assert
        Assert.Equal(expected, actual.IsDisable);
    }

    [Fact]
    public void GetTicketDetail_TicketIsRunningOrWaiting_WinLossDisplayHyphen()
    {
        // Arrange
        var item = new GetTicketModel
        {
            IsSecondAcceptFlag = true,
            Status = string.Empty,
            TransDate = DateTimeOffset.Now.DateTime
        };
        var userPermission = new UserPermission { SettledTicket = true };
        var betListCoreService = Substitute.For<BetListCoreService>();
        var checkBoxService = Substitute.For<CheckBoxService>();
        betListCoreService.GetOutrightTicket(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new TicketViewModel());
        betListCoreService.GetTicket(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new TicketViewModel());
        var service = new TicketServiceImp(betListCoreService, checkBoxService);

        // Act
        var actual = service.GetTicketDetail(item, userPermission, true);

        // Assert
        Assert.Equal("0", actual.WinLoss);
    }

    [Theory]
    [InlineData(true, "<span class='icon-tick'></span>")]
    [InlineData(false, "")]
    public void GetTicketDetail_CheckIsSecondAcceptFlag_ReturnIconTick(bool isSecondAcceptFlag, string expected)
    {
        // Arrange
        var item = new GetTicketModel
        {
            IsSecondAcceptFlag = isSecondAcceptFlag,
            Status = string.Empty,
            TransDate = DateTimeOffset.Now.DateTime
        };
        var userPermission = new UserPermission { SettledTicket = true };
        var betListCoreService = Substitute.For<BetListCoreService>();
        var checkBoxService = Substitute.For<CheckBoxService>();
        betListCoreService.GetOutrightTicket(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new TicketViewModel());
        betListCoreService.GetTicket(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new TicketViewModel());
        var service = new TicketServiceImp(betListCoreService, checkBoxService);

        // Act
        var actual = service.GetTicketDetail(item, userPermission, true);

        // Assert
        Assert.Equal(expected, actual.SecondAcceptFlag);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void GetTicketDetail_HaveNotPermissionArg_ReturnIsDisableWithPermission(bool isOutright)
    {
        // Arrange
        var item = new GetTicketModel
        {
            IsSecondAcceptFlag = true,
            Status = string.Empty,
            TransDate = DateTimeOffset.Now.DateTime
        };
        var betListCoreService = Substitute.For<BetListCoreService>();
        betListCoreService.GetOutrightTicket(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new TicketViewModel());
        betListCoreService.GetTicket(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new TicketViewModel());
        var service = new TicketServiceImp(betListCoreService, null);

        // Act
        var actual = service.GetTicketDetail(item, isOutright);

        // Assert
        Assert.False(actual.IsDisable);
    }
}