using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest;

public class BetListCoreServiceTests : IClassFixture<RemotingRefFixture>
{
    private readonly BetListService betListService;
    private readonly IMapper mapper;
    private readonly BetListCoreServiceImp service;

    public BetListCoreServiceTests()
    {
        betListService = Substitute.For<BetListService>();
        mapper = Substitute.For<IMapper>();
        service = new BetListCoreServiceImp(mapper, betListService);
    }

    [Theory]
    [InlineData(38, true, 11)]
    [InlineData(31, true, 13)]
    public void GetTicket_PlainTextForExportExcel_HasBetListServiceBuildChoice(short betTypeId, bool isParlay, int issueTypeId)
    {
        // Arrange
        var item = new GetTicketModel
        {
            BetType = betTypeId,
            IsLiveIndicator = true,
            BetdaqId = 1,
            IsMixParlay = isParlay,
            SubTransId = 1,
            Hdp1 = 1,
            Hdp2 = 2,
            OddsType = 3,
            RefNo = 4,
            AwayId = 1,
            HomeId = 0,
            LeagueId = 3
        };
        var match = new Match();
        const ChoiceType choiceType = ChoiceType.Excel;
        betListService.GetOdds(Arg.Any<Ticket>(), false).ReturnsForAnyArgs("a");
        betListService.BuildStake(Arg.Any<Ticket>(), Arg.Any<TicketHelper>()).ReturnsForAnyArgs("b");
        betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("c");
        betListService.GetStatus(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("d");
        betListService.BuildChoiceExcel(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("11");
        betListService.GetHandicap(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("a");
        mapper.Map<Ticket>(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new Ticket());

        // Act
        var actual = service.GetTicket(item, match, choiceType, issueTypeId);

        // Assert
        Assert.NotNull(actual);
        betListService.Received().GetOdds(Arg.Any<Ticket>(), false);
        betListService.Received().BuildStake(Arg.Any<Ticket>(), Arg.Any<TicketHelper>());
        betListService.Received().GetBetTypeName(Arg.Any<Ticket>());
        betListService.Received().GetStatus(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false);
        betListService.Received().GetHandicap(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false);
        betListService.Received().BuildChoiceExcel(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false);
    }

    [Theory]
    [InlineData(ChoiceType.Excel, 31, true, 13, "")]
    [InlineData(ChoiceType.Email, 38, false, 13, "<div id=11")]
    [InlineData(ChoiceType.Excel, 31, false, 11, "<div id=11")]
    public void GetTicket_NotPlainTextForExportExcel_ChoiceFromBuildChoiceParlay(ChoiceType choiceType, short betTypeId, bool isParlay, int issueTypeId, string expected)
    {
        // Arrange
        var item = new GetTicketModel
        {
            BetType = betTypeId,
            IsLiveIndicator = true,
            BetdaqId = 1,
            IsMixParlay = isParlay,
            SubTransId = 1,
            Hdp1 = 1,
            Hdp2 = 2,
            OddsType = 3,
            RefNo = 4,
            AwayId = 1,
            HomeId = 0,
            LeagueId = 3,
            SportType = 1
        };
        betListService.BuildChoice(Arg.Any<ITicket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("<div id=11");
        mapper.Map<Ticket>(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new Ticket());

        // Act
        var actual = service.GetTicket(item, null, choiceType, issueTypeId);

        // Assert
        Assert.Equal(expected, actual.Choice);
    }

    [Fact]
    public void GetTicket_HasNotAbnormalAccountOrAbnormalBet_MainChoiceHasReplaceValue()
    {
        // Arrange
        var issueTypeId = IssueTypeConstant.DangerAccepted;
        var item = new GetTicketModel
        {
            BetType = 38,
            IsLiveIndicator = true,
            BetdaqId = 1,
            IsMixParlay = true,
            SubTransId = 1,
            Hdp1 = 1,
            Hdp2 = 2,
            OddsType = 3,
            RefNo = 4,
            AwayId = 1,
            HomeId = 0,
            LeagueId = 3
        };
        const ChoiceType choiceType = new();
        betListService.BuildChoice(Arg.Any<ITicket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("<div id=11");
        mapper.Map<Ticket>(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new Ticket());

        // Act
        var actual = service.GetTicket(item, null, choiceType, issueTypeId);

        // Assert
        Assert.Equal("<div id='dvFavorite_1'><div id=11</div><div id=11<div id='divEvent_1'></div>", actual.Choice);
    }
}