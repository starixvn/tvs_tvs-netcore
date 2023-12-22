using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.Services.SendEmail.Void;
using TicketVoidingSystem.Services.SendMessage;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.Void;

public class BetListCoreServiceTests : IClassFixture<RemotingRefFixture>
{
    private readonly IMapper mapper;
    private readonly BetListService betListService;
    private readonly BetListCoreServiceImp service;

    public BetListCoreServiceTests()
    {
        mapper = Substitute.For<IMapper>();
        betListService = Substitute.For<BetListService>();
        var specialPlatformService = Substitute.For<SpecialPlatformService>();
        service = new BetListCoreServiceImp(mapper, betListService, specialPlatformService);
    }

    [Fact]
    public void BuildTicket_TicketEmailModelIsMainParlay_ReturnMainChoice()
    {
        // Arrange
        var item = new TicketEmailModel { IsMixParlay = true, BetTypeId = 29 };
        var match = new Match();

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
        var actual = service.BuildTicket(item, match, true);

        // Assert
        AssertExtension.Equal("Choice", actual.Choice);
    }

    [Fact]
    public void BuildTicket_TicketEmailModelIsnOTMixParlay_ReturnChoiceExpected()
    {
        // Arrange
        var item = new TicketEmailModel { IsMixParlay = false, BetTypeId = 29 };
        var match = new Match { LeagueGroupId = 42, OriginLeagueName = "Saba123", OriginLeagueNameSimplified = "沙巴123", OriginLeagueNameNewSimplified = "沙巴123" };

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
        var actual = service.BuildTicket(item, match, true);

        // Assert
        AssertExtension.Equal("ChoiceExcel", actual.Choice);
    }

    [Fact]
    public void BuildTicket_HasMatchIsNull_ReturnChoiceExcel()
    {
        // Arrange
        var item = new TicketEmailModel { IsMixParlay = false, BetTypeId = 29 };

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
        var actual = service.BuildTicket(item, null, true);

        // Assert
        AssertExtension.Equal("ChoiceExcel", actual.Choice);
    }
}