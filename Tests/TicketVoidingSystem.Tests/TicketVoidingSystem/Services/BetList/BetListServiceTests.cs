using System.Collections.Generic;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.Templates;
using Fanex.BetList.Core.TicketHelper;
using FizzWare.NBuilder;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.BetList;

public class BetListServiceTests : IClassFixture<RemotingRefFixture>
{
    private readonly OddsService oddsService;
    private readonly RemotingRefWrapperService remotingRefWrapperService;
    private BetListServiceImp service;

    public BetListServiceTests()
    {
        oddsService = Substitute.For<OddsService>();
        remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
        service = new BetListServiceImp(remotingRefWrapperService, oddsService);
    }

    [Fact]
    public void BuildChoiceBlock_ReturnChoice()
    {
        // Arrange
        const string expected =
            "<div class=''><span class='scoremap'><a href=\"javascript:OpenScoreMap(0,0,0);\"title=\"Score Map\">" +
            "<div class='scoremapIcon'></div></a></span><span class=\"underdog\"><span class='handicap'> 0</span>" +
            "</span><div class=\"bettype\"> </div><div class=\"match\"><span></span>" +
            "<span>&nbsp;-&nbsp;vs&nbsp;-&nbsp;</span><span></span></div><div class=\"league\"><span class=\"sport\">" +
            "</span><span class=\"leagueName\">&nbsp;</span></div></div>";
        service = new BetListServiceImp(null, null);

        // Act
        var actual = service.BuildChoiceBlock(new Ticket(), new TicketHelper(), new List<ITicketData>(), true);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void BuildChoice_ReturnChoice()
    {
        // Arrange
        const string expected =
            "<div class=''><span class='scoremap'><a href=\"javascript:OpenScoreMap(0,0,0);\"title=\"Score Map\">" +
            "<div class='scoremapIcon'></div></a></span><span class=\"underdog\"><span class='handicap'> 0</span></span>" +
            "<div class=\"bettype\"> </div><div class=\"match\"><span></span><span>&nbsp;-&nbsp;vs&nbsp;-&nbsp;</span>" +
            "<span></span></div><div class=\"league\"><span class=\"sport\"></span><span class=\"leagueName\">&nbsp;</span></div></div>";
        service = new BetListServiceImp(null, null);

        // Act
        var actual = service.BuildChoice(new Ticket(), new TicketHelper(), new List<ITicketData>(), true);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void BuildChoiceExcel_ReturnChoice()
    {
        // Arrange
        const string expected = " 0- vs -";
        service = new BetListServiceImp(null, null);

        // Act
        var actual = service.BuildChoiceExcel(new Ticket(), new TicketHelper(), new List<ITicketData>(), true);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void BuildStake_ReturnStake()
    {
        // Arrange
        const string expected = "<div class=\"stake\">0</div>";
        service = new BetListServiceImp(null, null);

        // Act
        var actual = service.BuildStake(new Ticket(), new TicketHelper());

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void GetOdds_IsParlayIsTrue_EmptyOddName()
    {
        // Arrange
        var ticket = new Ticket();

        service = new BetListServiceImp(remotingRefWrapperService, oddsService);

        // Act
        var result = service.GetOdds(ticket, true);

        // Assert
        Assert.Equal("<span class=\"underdog\">-</span> <span class=\"oddstype\"></span>", result);
    }

    [Fact]
    public void GetOdds_OddNameIsNotNullOrWhiteSpace_ReturnOddHtmlWithReplacedBrTagsAndClosingBracket()
    {
        // Arrange
        var ticket = new Ticket();
        const string oddName = "OddName";
        oddsService.GetOddsName(Arg.Any<string>()).Returns(oddName);

        // Act
        var result = service.GetOdds(ticket, false);

        // Assert
        Assert.Equal("<span class=\"underdog\">-</span> (<span class=\"oddstype\"></span>)", result);
    }

    [Fact]
    public void GetBetType_ReturnName()
    {
        // Arrange
        const string expected = "handicap";
        remotingRefWrapperService.GetBetType(default, default).ReturnsForAnyArgs(expected);
        service = new BetListServiceImp(remotingRefWrapperService, null);

        // Act
        var actual = service.GetBetType(226, LanguageCode.English);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void GetBetTypeName_ReturnName()
    {
        // Arrange
        var ticket = new Ticket
        {
            BetId = 224,
            BetTeam = "h"
        };
        service = new BetListServiceImp(null, null);

        // Act
        var actual = service.GetBetTypeName(ticket);

        // Assert
        Assert.Equal("", actual);
    }

    [Fact]
    public void GetBetTypeNameChineseSimplified_ReturnName()
    {
        // Arrange
        var ticket = new Ticket
        {
            BetId = 224,
            BetTeam = "h"
        };
        service = new BetListServiceImp(null, null);

        // Act
        var actual = service.GetBetTypeNameChineseSimplified(ticket);

        // Assert
        Assert.Equal("", actual);
    }

    [Fact]
    public void GetBetTypeNameChineseTraditional_ReturnName()
    {
        // Arrange
        var ticket = new Ticket
        {
            BetId = 224,
            BetTeam = "h"
        };
        service = new BetListServiceImp(null, null);

        // Act
        var actual = service.GetBetTypeNameChineseTraditional(ticket);

        // Assert
        Assert.Equal("", actual);
    }

    [Fact]
    public void GetBetTypeNameNewChineseSimplified_ReturnName()
    {
        // Arrange
        var ticket = new Ticket
        {
            BetId = 224,
            BetTeam = "h"
        };
        service = new BetListServiceImp(null, null);

        // Act
        var actual = service.GetBetTypeNameNewChineseSimplified(ticket);

        // Assert
        Assert.Equal("", actual);
    }

    [Theory]
    [InlineData(1, "1")]
    [InlineData(85, "85")]
    [InlineData(86, "86")]
    [InlineData(1, "")]
    public void GetBetTypeName_HasRefNo_ReturnName(int betId, string betTypeIdByRef)
    {
        // Arrange
        remotingRefWrapperService.GetParentIdByBetTypeId(default).ReturnsForAnyArgs(betTypeIdByRef);
        service = new BetListServiceImp(remotingRefWrapperService, null);

        // Act
        var actual = service.GetBetTypeName(betId, 1000);

        // Assert
        Assert.NotNull(actual);
    }

    [Fact]
    public void GetBetTeam_ReturnName()
    {
        // Arrange
        const string expected =
            "<div class=''><span class=\"{betTeamClassName}\">{betTeam}</span><div class=\"event-date\">{eventDate}</div></div>";
        service = new BetListServiceImp(null, null);

        // Act
        var actual = service.GetBetTeam(new Choice_Template());

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void GetStatus_ReturnStatus()
    {
        // Arrange
        var ticket = Builder<Ticket>.CreateNew().Build();
        const string expected = "<div class=\"status\">status1</div>";
        var ticketHelper = new TicketHelper
        {
            ShowSystemParlayDetail = false,
            IsShowOddsWithChoice = true,
            HideStatusCashOutHistory = true
        };
        service = new BetListServiceImp(null, null);

        // Act
        var actual = service.GetStatus(ticket, ticketHelper, null, false);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData("")]
    [InlineData("86")]
    public void GetComboParlayName_ReturnName(string betCheck)
    {
        // Arrange
        var comboNames = new[] { "1", "2" };
        var ticket = Builder<Ticket>.CreateNew().With(x => x.BetCheck = betCheck).Build();
        remotingRefWrapperService.GetComboParlayName(default, default, default, default).ReturnsForAnyArgs(comboNames);
        service = new BetListServiceImp(remotingRefWrapperService, null);

        // Act
        var actual = service.GetComboParlayName(ticket);

        // Assert
        Assert.NotNull(actual);
    }

    [Fact]
    public void GetComboName_ReturnName()
    {
        // Arrange
        var comboNames = new[] { "1", "2" };
        remotingRefWrapperService.GetComboParlayName(default, default, default, default).ReturnsForAnyArgs(comboNames);
        service = new BetListServiceImp(remotingRefWrapperService, null);

        // Act
        var actual = service.GetComboName(null, null, 1, 1);

        // Assert
        Assert.Equal(comboNames, actual);
    }

    [Fact]
    public void GetMatchCodeBetradar_ReturnCode()
    {
        // Arrange
        const string expected = "AAA";
        remotingRefWrapperService.GetMatchCodeBetRadar(default).ReturnsForAnyArgs(expected);
        service = new BetListServiceImp(remotingRefWrapperService, null);

        // Act
        var actual = service.GetMatchCodeBetradar(null);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void GetSportTypeName_ReturnName()
    {
        // Arrange
        const string expected = "AAA";
        remotingRefWrapperService.GetSportName(default, default).ReturnsForAnyArgs(expected);
        service = new BetListServiceImp(remotingRefWrapperService, null);

        // Act
        var actual = service.GetSportTypeName(1, null);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void GetDisplayedBetTypeName_ReturnsBetTypeName_FromRemotingRefWrapperService()
    {
        // Arrange
        const int id = 123;
        const long refNo = 456;
        const string expectedBetName = "Bet Type Name";

        remotingRefWrapperService.GetParentIdByBetTypeId(id).Returns("ParentId");
        remotingRefWrapperService.GetDisplayedBetTypeName("ParentId", refNo).Returns(expectedBetName);

        // Act
        var result = service.GetDisplayedBetTypeName(id, refNo);

        // Assert
        Assert.Equal(expectedBetName, result);
    }

    [Fact]
    public void GetDisplayedBetTypeName_ReturnsIdAsString_WhenBetTypeIdIsNull()
    {
        // Arrange
        const int id = 123;
        const long refNo = 456;
        const string betName = "123";
        const string expected = "123";

        remotingRefWrapperService.GetParentIdByBetTypeId(id).Returns((string)null);
        remotingRefWrapperService.GetDisplayedBetTypeName("123", refNo).Returns(betName);

        // Act
        var result = service.GetDisplayedBetTypeName(id, refNo);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void GetDisplayedBetTypeName_ReturnsNextBetTypeNameForFistNextBet()
    {
        // Arrange
        const int id = 86;
        const long refNo = 456;
        const string expectedBetName = "Bet Type Name";

        remotingRefWrapperService.GetParentIdByBetTypeId(id).Returns("ParentId");
        remotingRefWrapperService.GetDisplayedBetTypeName("ParentId", refNo).Returns(expectedBetName);

        // Act
        var result = service.GetDisplayedBetTypeName(id, refNo);

        // Assert
        Assert.Equal("Next " + expectedBetName, result);
    }

    [Fact]
    public void GetDisplayedBetTypeName_ReturnsNextBetTypeNameForSecondNextBet()
    {
        // Arrange
        const int id = 85;
        const long refNo = 456;
        const string expectedBetName = "Bet Type Name";

        remotingRefWrapperService.GetParentIdByBetTypeId(id).Returns("ParentId");
        remotingRefWrapperService.GetDisplayedBetTypeName("ParentId", refNo).Returns(expectedBetName);

        // Act
        var result = service.GetDisplayedBetTypeName(id, refNo);

        // Assert
        Assert.Equal("Next " + expectedBetName, result);
    }

    [Fact]
    public void GetHandicap_ReturnsEmptyString_BetTypeIdIsHideHandicap()
    {
        // Arrange
        var ticket = Substitute.For<ITicket>();
        var ticketHelper = Substitute.For<ITicketHelper>();
        var ticketData = new List<ITicketData>();
        ticket.BetTypeId = 1605;

        // tr
        var result = service.GetHandicap(ticket, ticketHelper, ticketData, true);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void GetHandicap_ReturnsHandicapInnerText()
    {
        // Arrange
        var ticket = Substitute.For<ITicket>();
        var ticketHelper = Substitute.For<ITicketHelper>();
        var ticketData = new List<ITicketData>();

        // Act
        var result = service.GetHandicap(ticket, ticketHelper, ticketData, true);

        // Assert
        Assert.NotNull(result);
    }
}