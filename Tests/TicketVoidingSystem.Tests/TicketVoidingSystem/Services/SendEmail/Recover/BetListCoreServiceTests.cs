using System;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.Services.SendEmail.Recover;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.Recover;

public class BetListCoreServiceTests : IClassFixture<RemotingRefFixture>
{
    [Theory]
    [InlineData("1", 29)]
    [InlineData("6", 29)]
    [InlineData("1", BetTypeConstant.SabaOUTimeMachine)]
    [InlineData("6", BetTypeConstant.SabaOUTimeMachine)]
    public void GetNormalTicket_ReturnExpected(string oddsType, int betType)
    {
        // Arrange
        var item = new TicketRecoverEmailModel
        {
            BetType = betType,
            OddsType = Convert.ToByte(oddsType),
            RefNo = 1,
            WalletType = 1,
            IsLiveIndicator = true
        };
        var ticket = new Ticket
        {
            BetTypeId = betType,
            OddsType = "1",
            RefNo = "1",
            WalletType = 1,
            IsLive = true
        };
        var expectedModel = new TicketRecoverEmailViewModel
        {
            Choice = "choice",
            Handicap = "1",
            Odds = "1",
            Stake = "1",
            Status = "done"
        };
        var mapper = Substitute.For<IMapper>();
        var betListService = Substitute.For<BetListService>();
        mapper.Map<Ticket>(item).ReturnsForAnyArgs(ticket);
        betListService.BuildChoice(ticket, Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("choice");
        betListService.GetHandicap(ticket, Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("1");
        betListService.GetOdds(ticket, item.BetType.IsParlay()).ReturnsForAnyArgs("1");
        betListService.BuildStake(ticket, Arg.Any<TicketHelper>()).ReturnsForAnyArgs("1");
        betListService.GetStatus(ticket, Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("done");
        var service = new BetListCoreServiceImp(mapper, betListService);

        // Act
        var actual = service.GetNormalTicket(item);

        // Assert
        AssertExtension.Equal(expectedModel, actual);
    }

    [Theory]
    [InlineData(29)]
    [InlineData(1)]
    public void GetMainParlayTicket_ReturnExpected(int betType)
    {
        // Arrange
        var item = new TicketRecoverEmailModel
        {
            BetType = betType,
            OddsType = 1,
            RefNo = 1,
            WalletType = 1,
            IsLiveIndicator = true,
            Status = "done"
        };
        var ticket = new Ticket
        {
            BetTypeId = betType,
            OddsType = "1",
            RefNo = "1",
            WalletType = 1,
            IsLive = true
        };
        var expectedModel = new TicketRecoverEmailViewModel
        {
            Choice = "choice" + $"<div id='divEvent_{item.RefNo}'></div>",
            Odds = "1",
            Stake = "1",
            Status = "done",
            BetType = "1"
        };
        var mapper = Substitute.For<IMapper>();
        var betListService = Substitute.For<BetListService>();
        mapper.Map<Ticket>(item).ReturnsForAnyArgs(ticket);
        betListService.BuildChoice(ticket, Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("choice");
        betListService.GetOdds(ticket, item.BetType.IsParlay()).ReturnsForAnyArgs("1");
        betListService.BuildStake(ticket, Arg.Any<TicketHelper>()).ReturnsForAnyArgs("1");
        betListService.GetBetTypeName(ticket).ReturnsForAnyArgs("1");
        var service = new BetListCoreServiceImp(mapper, betListService);

        // Act
        var actual = service.GetMainParlayTicket(item);

        // Assert
        AssertExtension.Equal(expectedModel, actual);
    }
}