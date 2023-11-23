using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Services.GetTickets;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Services.GetTickets;


public class BetListCoreServiceTest : IClassFixture<RemotingRefFixture>
{
    [Fact]
    public void BuildChoice_SettingTicketHelper_HideLeague()
    {
        // Arrange
        var item = new GetTicketModel();
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(new Ticket());
        var betListCoreService = new BetListCoreServiceImp(mapper, betListService);

        // Act
        betListCoreService.GetTicket(item);

        // Assert
        betListService
            .Received()
            .BuildChoice(Arg.Any<ITicket>(), Arg.Is<TicketHelper>(x => !x.ShowLeague), null, false);
    }

    [Fact]
    public void BuildChoice_SettingTicketHelper_HideMatch()
    {
        // Arrange
        var item = new GetTicketModel();
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(new Ticket());
        var betListCoreService = new BetListCoreServiceImp(mapper, betListService);

        // Act
        betListCoreService.GetTicket(item);

        // Assert
        betListService
            .Received()
            .BuildChoice(Arg.Any<ITicket>(), Arg.Is<TicketHelper>(x => !x.ShowMatch), null, false);
    }

    [Fact]
    public void BuildChoice_SettingTicketHelper_HideParlayDetail()
    {
        // Arrange
        var item = new GetTicketModel();
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(new Ticket());
        var betListCoreService = new BetListCoreServiceImp(mapper, betListService);

        // Act
        betListCoreService.GetTicket(item);

        // Assert
        betListService
            .Received()
            .BuildChoice(Arg.Any<ITicket>(), Arg.Is<TicketHelper>(x => !x.ShowSystemParlayDetail), null, false);
    }

    [Theory]
    [InlineData(true, 1, "")]
    [InlineData(false, 1, "1")]
    public void SetTicket_IsMixParlay_OddsTypeIsEmpty(bool isMixParlay, int oddsType, string expected)
    {
        // Arrange
        var item = new GetTicketModel { IsMixParlay = isMixParlay, OddsType = oddsType };
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(new Ticket());
        var betListCoreService = new BetListCoreServiceImp(mapper, betListService);

        // Act
        betListCoreService.GetTicket(item);

        // Assert
        betListService
            .Received()
            .BuildChoice(Arg.Is<ITicket>(x => x.OddsType == expected), Arg.Any<TicketHelper>(), null, false);
    }

    [Theory]
    [InlineData(true, 123456, null)]
    [InlineData(false, 12345611111, 12345611111)]
    public void SetTicket_IsMixParlay_BetIdIsZero(bool isMixParlay, long betId, long? expected)
    {
        // Arrange
        var item = new GetTicketModel { IsMixParlay = isMixParlay, BetId = betId };
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(new Ticket());
        var betListCoreService = new BetListCoreServiceImp(mapper, betListService);

        // Act
        betListCoreService.GetTicket(item);

        // Assert
        betListService
            .Received()
            .BuildChoice(Arg.Is<ITicket>(x => x.BetId == expected), Arg.Any<TicketHelper>(), null, false);
    }

    [Theory]
    [InlineData(true, "BetCheck", "SubBetCheck", "SubBetCheck")]
    [InlineData(false, "BetCheck", "SubBetCheck", "BetCheck")]
    public void SetTicket_IsMixParlay_SetBetCheckBySubTicket(bool isMixParlay, string betCheck, string subBetCheck, string expected)
    {
        // Arrange
        var item = new GetTicketModel { IsMixParlay = isMixParlay, BetCheck = betCheck, SubBetCheck = subBetCheck };
        var ticket = new Ticket { BetCheck = betCheck };
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(ticket);
        var betListCoreService = new BetListCoreServiceImp(mapper, betListService);

        // Act
        betListCoreService.GetTicket(item);

        // Assert
        betListService
            .Received()
            .BuildChoice(Arg.Is<ITicket>(x => x.BetCheck == expected), Arg.Any<TicketHelper>(), null, false);
    }

    [Theory]
    [InlineData(true, "BetTeam", "SubBetTeam", "SubBetTeam")]
    [InlineData(false, "BetTeam", "SubBetTeam", "BetTeam")]
    public void SetTicket_IsMixParlay_SetBetTeamBySubTicket(bool isMixParlay, string betTeam, string subBetTeam, string expected)
    {
        // Arrange
        var item = new GetTicketModel { IsMixParlay = isMixParlay, BetTeam = betTeam, SubBetTeam = subBetTeam };
        var ticket = new Ticket { BetTeam = betTeam };
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(ticket);
        var betListCoreService = new BetListCoreServiceImp(mapper, betListService);

        // Act
        betListCoreService.GetTicket(item);

        // Assert
        betListService
            .Received()
            .BuildChoice(Arg.Is<ITicket>(x => x.BetTeam == expected), Arg.Any<TicketHelper>(), null, false);
    }

    [Theory]
    [InlineData(true, 29, 1, 1)]
    [InlineData(false, 29, 1, 29)]
    public void SetTicket_IsMixParlay_SetBetTypeBySubTicket(bool isMixParlay, int betType, int subBetType, int expected)
    {
        // Arrange
        var item = new GetTicketModel { IsMixParlay = isMixParlay, BetType = betType, SubBetType = subBetType };
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(new Ticket());
        var betListCoreService = new BetListCoreServiceImp(mapper, betListService);

        // Act
        betListCoreService.GetTicket(item);

        // Assert
        betListService
            .Received()
            .BuildChoice(Arg.Is<ITicket>(x => x.BetTypeId == expected), Arg.Any<TicketHelper>(), null, false);
    }

    [Theory]
    [InlineData(true, 1, 1.5, 1.5)]
    [InlineData(false, 1, 1.5, 1)]
    public void SetTicket_IsMixParlay_SetHandicap1BySubTicket(bool isMixParlay, double hdp1, double subHdp1, double expected)
    {
        // Arrange
        var item = new GetTicketModel { IsMixParlay = isMixParlay, Hdp1 = (decimal)hdp1, SubHdp1 = (decimal)subHdp1 };
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(new Ticket());
        var betListCoreService = new BetListCoreServiceImp(mapper, betListService);

        // Act
        betListCoreService.GetTicket(item);

        // Assert
        betListService
            .Received()
            .BuildChoice(Arg.Is<ITicket>(x => x.Handicap1 == (decimal)expected), Arg.Any<TicketHelper>(), null, false);
    }

    [Theory]
    [InlineData(true, 1, 1.5, 1.5)]
    [InlineData(false, 1, 1.5, 1)]
    public void SetTicket_IsMixParlay_SetHandicap2BySubTicket(bool isMixParlay, double hdp2, double subHdp2, double expected)
    {
        // Arrange
        var item = new GetTicketModel { IsMixParlay = isMixParlay, Hdp2 = (decimal)hdp2, SubHdp2 = (decimal)subHdp2 };
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(new Ticket());
        var betListCoreService = new BetListCoreServiceImp(mapper, betListService);

        // Act
        betListCoreService.GetTicket(item);

        // Assert
        betListService
            .Received()
            .BuildChoice(Arg.Is<ITicket>(x => x.Handicap2 == (decimal)expected), Arg.Any<TicketHelper>(), null, false);
    }

    [Theory]
    [InlineData(true, 1.98, 0.98, 0.98)]
    [InlineData(false, 1.98, 0.98, 1.98)]
    public void SetTicket_IsMixParlay_SetOddsBySubTicket(bool isMixParlay, double odds, double subOdds, double expected)
    {
        // Arrange
        var item = new GetTicketModel { IsMixParlay = isMixParlay, Odds = (decimal)odds, SubOdds = (decimal)subOdds };
        var ticket = new Ticket { Odds = (decimal)odds };
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(ticket);
        var betListCoreService = new BetListCoreServiceImp(mapper, betListService);

        // Act
        betListCoreService.GetTicket(item);

        // Assert
        betListService
            .Received()
            .BuildChoice(Arg.Is<ITicket>(x => x.Odds == (decimal)expected), Arg.Any<TicketHelper>(), null, false);
    }

    [Fact]
    public void GetOutrightTicket_SettingTicketHelper_HideLeague()
    {
        // Arrange
        var item = new GetTicketModel();
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(new Ticket());
        var betListCoreService = new BetListCoreServiceImp(mapper, betListService);

        // Act
        betListCoreService.GetOutrightTicket(item);

        // Assert
        betListService
            .Received()
            .BuildChoice(Arg.Any<ITicket>(), Arg.Is<TicketHelper>(x => !x.ShowLeague), null, false);
    }
}