using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.Services.SendEmail.Void;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.Void;

public class BetListCoreServiceTests : IClassFixture<RemotingRefFixture>
{
    private readonly BetListService betListService;
    private readonly IMapper mapper;
    private readonly BetListCoreServiceImp service;

    public BetListCoreServiceTests()
    {
        mapper = Substitute.For<IMapper>();
        betListService = Substitute.For<BetListService>();
        service = new BetListCoreServiceImp(mapper, betListService);
    }

    [Theory]
    [InlineData(SpecialPlatformConstant.JollySports, "Pe4", "MP")]
    [InlineData(SpecialPlatformConstant.JollySports, "pe4", "MP")]
    [InlineData(SpecialPlatformConstant.JollySports, "PE4", "MP")]
    [InlineData(SpecialPlatformConstant.JollySports, "EE", "EE")]
    [InlineData(SpecialPlatformConstant.JollySports, "", "")]
    [InlineData(SpecialPlatformConstant.NormalSite, "PE4", "PE4")]
    public void BuildTicket_HasValidData_ReturnTicketEmailViewModel(int specialPlatform, string currencyName, string currencyNameExpected)
    {
        // Arrange
        var item = new TicketEmailModel
        { IsMixParlay = true, CurrencyName = currencyName, BetTypeId = BetTypeConstant.BitCoinOverUnder };
        var match = new Match();
        var site = new SiteEmail{ SpecialPlatform  = specialPlatform };
        var expected = new TicketEmailViewModel
        {
            Odds = "Odds",
            Handicap = "Handicap",
            Stake = "Stake",
            BetType = "BetType",
            Status = "Status",
            Choice = "Choice",
            BetTypeSimplified = "BetTypeSimplified",
            Currency = currencyNameExpected
        };
        mapper.Map<Ticket>(Arg.Any<TicketEmailModel>()).ReturnsForAnyArgs(new Ticket());
        betListService.GetOdds(Arg.Any<Ticket>(), false).ReturnsForAnyArgs("Odds");
        betListService.BuildStake(Arg.Any<Ticket>(), Arg.Any<TicketHelper>()).ReturnsForAnyArgs("Stake");
        betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("BetType");
        betListService.GetBetTypeNameChineseSimplified(Arg.Any<Ticket>()).ReturnsForAnyArgs("BetTypeSimplified");
        betListService.GetStatus(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("Status");
        betListService.GetHandicap(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false)
            .ReturnsForAnyArgs("Handicap");
        betListService.BuildChoice(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("Choice");

        // Act
        var actual = service.BuildTicket(item, match, site, true);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public void BuildTicket_TicketEmailModelIsMainParlay_ReturnMainChoice()
    {
        // Arrange
        var item = new TicketEmailModel { IsMixParlay = true, BetTypeId = 29 };
        var match = new Match();
        var site = new SiteEmail();

        mapper.Map<Ticket>(Arg.Any<TicketEmailModel>()).ReturnsForAnyArgs(new Ticket());
        betListService.GetOdds(Arg.Any<Ticket>(), false).ReturnsForAnyArgs("Odds");
        betListService.BuildStake(Arg.Any<Ticket>(), Arg.Any<TicketHelper>()).ReturnsForAnyArgs("Stake");
        betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("BetType");
        betListService.GetBetTypeNameChineseSimplified(Arg.Any<Ticket>()).ReturnsForAnyArgs("BetTypeSimplified");
        betListService.GetStatus(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("Status");
        betListService.GetHandicap(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false)
            .ReturnsForAnyArgs("Handicap");
        betListService.BuildChoice(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("Choice");

        // Act
        var actual = service.BuildTicket(item, match, site, true);

        // Assert
        AssertExtension.Equal("Choice", actual.Choice);
    }

    [Fact]
    public void BuildTicket_TicketEmailModelIsnOTMixParlay_ReturnChoiceExpected()
    {
        // Arrange
        var item = new TicketEmailModel { IsMixParlay = false, BetTypeId = 29 };
        var match = new Match { LeagueGroupId = 42 };
        var site = new SiteEmail { IsChinaView = true };

        mapper.Map<Ticket>(Arg.Any<TicketEmailModel>()).ReturnsForAnyArgs(new Ticket());
        betListService.GetOdds(Arg.Any<Ticket>(), false).ReturnsForAnyArgs("Odds");
        betListService.BuildStake(Arg.Any<Ticket>(), Arg.Any<TicketHelper>()).ReturnsForAnyArgs("Stake");
        betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("BetType");
        betListService.GetBetTypeNameChineseSimplified(Arg.Any<Ticket>()).ReturnsForAnyArgs("BetTypeSimplified");
        betListService.GetStatus(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("Status");
        betListService.GetHandicap(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false)
            .ReturnsForAnyArgs("Handicap");
        betListService.BuildChoice(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("Choice");
        betListService.BuildChoiceExcel(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false)
            .ReturnsForAnyArgs("ChoiceExcel");
        // Act
        var actual = service.BuildTicket(item, match, site, true);

        // Assert
        AssertExtension.Equal("ChoiceExcel", actual.Choice);
    }

    [Fact]
    public void BuildTicket_HasMatchIsNull_ReturnChoiceExcel()
    {
        // Arrange
        var item = new TicketEmailModel { IsMixParlay = false, BetTypeId = 29 };
        var site = new SiteEmail { IsChinaView = true };

        mapper.Map<Ticket>(Arg.Any<TicketEmailModel>()).ReturnsForAnyArgs(new Ticket());
        betListService.GetOdds(Arg.Any<Ticket>(), false).ReturnsForAnyArgs("Odds");
        betListService.BuildStake(Arg.Any<Ticket>(), Arg.Any<TicketHelper>()).ReturnsForAnyArgs("Stake");
        betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("BetType");
        betListService.GetBetTypeNameChineseSimplified(Arg.Any<Ticket>()).ReturnsForAnyArgs("BetTypeSimplified");
        betListService.GetStatus(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("Status");
        betListService.GetHandicap(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false)
            .ReturnsForAnyArgs("Handicap");
        betListService.BuildChoice(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("Choice");
        betListService.BuildChoiceExcel(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false)
            .ReturnsForAnyArgs("ChoiceExcel");
        // Act
        var actual = service.BuildTicket(item, null, site, true);

        // Assert
        AssertExtension.Equal("ChoiceExcel", actual.Choice);
    }
}