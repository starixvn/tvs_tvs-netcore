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

namespace TicketVoidingSystem.Tests.Services.BetList;

public class BetListServiceTests : IClassFixture<RemotingRefFixture>
{
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
        var service = new BetListServiceImp(null, null);

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
        var service = new BetListServiceImp(null, null);

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
        var service = new BetListServiceImp(null, null);

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
        var service = new BetListServiceImp(null, null);

        // Act
        var actual = service.BuildStake(new Ticket(), new TicketHelper());

        // Assert
        Assert.Equal(expected, actual);
    }

    //[Theory]
    //[InlineData(true)]
    //[InlineData(false)]
    //public void GetOdds_ReturnOdds(bool isParlay)
    //{
    //    // Arrange
    //    GetCachePropertyById cache = id => "";
    //    var ticket = Builder<Ticket>.CreateNew().Build();
    //    var oddsService = Substitute.For<OddsService>();
    //    oddsService.GetOdds(default, default, default).ReturnsForAnyArgs(1);
    //    var remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
    //    var service = new BetListServiceImp(remotingRefWrapperService, oddsService);

    //    // Act
    //    var actual = service.GetOdds(ticket, isParlay);

    //    // Assert
    //    Assert.NotNull(actual);
    //}

    [Fact]
    public void GetBetType_ReturnName()
    {
        // Arrange
        const string expected = "handicap";
        var remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
        remotingRefWrapperService.GetBetType(default, default).ReturnsForAnyArgs(expected);
        var service = new BetListServiceImp(remotingRefWrapperService, null);

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
        var service = new BetListServiceImp(null, null);

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
        var service = new BetListServiceImp(null, null);

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
        var service = new BetListServiceImp(null, null);

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
        var service = new BetListServiceImp(null, null);

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
        var remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
        remotingRefWrapperService.GetParentIdByBetTypeId(default).ReturnsForAnyArgs(betTypeIdByRef);
        var service = new BetListServiceImp(remotingRefWrapperService, null);

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
        var service = new BetListServiceImp(null, null);

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
        var service = new BetListServiceImp(null, null);

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
        var remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
        remotingRefWrapperService.GetComboParlayName(default, default, default, default).ReturnsForAnyArgs(comboNames);
        var service = new BetListServiceImp(remotingRefWrapperService, null);

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
        var remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
        remotingRefWrapperService.GetComboParlayName(default, default, default, default).ReturnsForAnyArgs(comboNames);
        var service = new BetListServiceImp(remotingRefWrapperService, null);

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
        var remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
        remotingRefWrapperService.GetMatchCodeBetRadar(default).ReturnsForAnyArgs(expected);
        var service = new BetListServiceImp(remotingRefWrapperService, null);

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
        var remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
        remotingRefWrapperService.GetSportName(default, default).ReturnsForAnyArgs(expected);
        var service = new BetListServiceImp(remotingRefWrapperService, null);

        // Act
        var actual = service.GetSportTypeName(1, null);

        // Assert
        Assert.Equal(expected, actual);
    }
}