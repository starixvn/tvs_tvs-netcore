using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using NSubstitute;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.Common.Services;
using SpecialDelete.VirtualSports.Common.ViewModels;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.Common.Services;

public class BetListVirtualSportsServiceTest : IClassFixture<RemotingRefFixture>
{
    [Fact]
    public void CreateTicketHelper_DisplayOddsAndHideParlayDetail()
    {
        // Arrange
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(new Ticket());
        var service = new BetListVirtualSportsServiceImp(mapper, betListService);

        // Act
        var ticketHelper = service.CreateTicketHelper();

        // Assert
        Assert.True(ticketHelper.IsShowOddsWithChoice);
        Assert.False(ticketHelper.ShowSystemParlayDetail);
    }

    [Fact]
    public void SetValue_ValidTicketModel_CreateTicketBetList()
    {
        // Arrange
        var item = new GetTicketModel { BetId = 123 };
        var ticket = new Ticket { BetId = 123 };
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(ticket);
        var service = new BetListVirtualSportsServiceImp(mapper, betListService);

        // Act
        var actual = service.SetValue(item);

        // Assert
        Assert.Equal(item.BetId, actual.BetId);
    }

    [Fact]
    public void SetSubValue_ValidTicketModel_CreateTicketBetList()
    {
        // Arrange
        var item = new GetTicketModel
        {
            SubBetCheck = "SubBetCheck",
            SubOdds = 0.98m,
            SubBetTeam = "SubBetTeam",
            SubBetType = 1,
            SubHdp1 = 1.00m,
            SubHdp2 = 2.00m
        };
        var ticket = new Ticket
        {
            BetCheck = "BetCheck",
            Odds = 1.98m,
            BetTeam = "BetTeam",
            BetTypeId = 29,
            Handicap1 = 2.00m,
            Handicap2 = 3.00m
        };
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(new Ticket());
        var service = new BetListVirtualSportsServiceImp(mapper, betListService);

        // Act
        var subTicket = service.SetSubValue(ticket, item);

        // Assert
        Assert.Equal(item.SubBetCheck, subTicket.BetCheck);
        Assert.Equal(item.SubOdds, subTicket.Odds);
        Assert.Equal(item.SubBetTeam, subTicket.BetTeam);
        Assert.Equal(item.SubBetType, subTicket.BetTypeId);
        Assert.Equal(item.SubHdp1, subTicket.Handicap1);
        Assert.Equal(item.SubHdp2, subTicket.Handicap2);
    }

    [Fact]
    public void Create_TicketViewModel_CallBetListService()
    {
        // Arrange
        var expected = new TicketViewModel
        {
            Odds = "<span class=\"underdog\">2.2</span>",
            Stake = "<div class=\"stake\">100</div>",
            Status = "<div class=\"status\">Running</div>"
        };
        var ticket = new Ticket { BetId = 123 };
        var ticketHelper = new TicketHelper();
        var betListService = Substitute.For<BetListService>();
        betListService.GetOdds(ticket, true).ReturnsForAnyArgs(expected.Odds);
        betListService.BuildStake(ticket, new TicketHelper()).ReturnsForAnyArgs(expected.Stake);
        betListService.GetStatus(ticket, ticketHelper, null, false).ReturnsForAnyArgs(expected.Status);
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(new Ticket());
        var service = new BetListVirtualSportsServiceImp(mapper, betListService);

        // Act
        var viewModel = service.Create(ticket, ticketHelper);

        // Assert
        AssertExtension.Equal(expected.Odds, viewModel.Odds);
        AssertExtension.Equal(expected.Stake, viewModel.Stake);
        AssertExtension.Equal(expected.Status, viewModel.Status);
    }
}