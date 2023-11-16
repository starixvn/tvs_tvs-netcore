using System;
using System.Collections.Generic;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Extension;

public class ObjectToXmlExtensionFacts
{
    [Fact]
    public void ToRequestXml_HasRequest_ReturnXML()
    {
        // Arrange
        const string expected = "<Requests><Request RequestId='1002' TransIds='12' /></Requests>";

        var model = new List<RequestXMLModel>
        {
            new() { RequestId = 1002, TransIds = "12" }
        };

        // Act
        var actual = model.ToRequestXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToRequestXml_RequestEmpty_ReturnEmpty()
    {
        // Arrange
        var model = new List<RequestXMLModel>();

        // Act
        var actual = model.ToRequestXml();

        // Assert
        Assert.Empty(actual);
    }

    [Fact]
    public void ToRequestIdXml_ModelHasMoreItem_ReturnXmlString()
    {
        // Arrange
        var expected = $"<RequestId Id='1' />{Environment.NewLine}<RequestId Id='2' />";

        var model = new List<int> { 1, 2 };

        // Act
        var actual = model.ToRequestIdXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToRequestIdXml_ModelHasOneItem_ReturnXmlString()
    {
        // Arrange
        const string expected = "<RequestId Id='1' />";

        var model = new List<int> { 1 };

        // Act
        var actual = model.ToRequestIdXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToRequestIdXml_RequestEmpty_ReturnEmpty()
    {
        // Arrange
        var model = new List<int>();

        // Act
        var actual = model.ToRequestIdXml();

        // Assert
        Assert.Empty(actual);
    }

    [Fact]
    public void ToEventWrongScoreXml_HasNoData_ReturnEmpty()
    {
        // Arrange
        var models = new List<WrongScoreInfoViewModel>();

        // Act
        var actual = models.ToEventWrongScoreXml();

        // Assert
        Assert.Empty(actual);
    }

    [Fact]
    public void ToEventWrongScoreXml_HasData_ReturnXML()
    {
        // Arrange
        var expected =
            "<root><r LiveHomeScore='1' LiveAwayScore='1' ScoreId='3' AATime='' PATime='' SATime='' LiveScores='1-1' " +
            "SubIssueTypeId='0' FilterFromTransTime='2018-10-30 16:20:20.222' FilterToTransTime='2018-10-30 16:20:20.222' " +
            "VoidFromTime='2018-10-30 16:20:20.222' VoidToTime='2018-10-30 16:20:20.222' MatchId='123' SingleCount='1' " +
            "MainParlayCount='1' ActualScore='2-2' FilterBy='' IsCheckedVar='' MinTime='' MinType='' />" +
            Environment.NewLine +
            "<r LiveHomeScore='' LiveAwayScore='' ScoreId='0' AATime='' PATime='' SATime='' LiveScores='' " +
            "SubIssueTypeId='0' FilterFromTransTime='0001-01-01 00:00:00.000' FilterToTransTime='' VoidFromTime='' " +
            "VoidToTime='' MatchId='' SingleCount='' MainParlayCount='' ActualScore='' FilterBy='' IsCheckedVar='' " +
            "MinTime='' MinType='' /></root>";

        var logInfoDetail = new LogInfoDetail
        {
            MatchId = 123,
            LiveScores = "1-1",
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            SingleCount = 1,
            CashOutCount = 1,
            InstantlySettleCount = 1,
            MainParlayCount = 1
        };
        var model = new WrongScoreInfoViewModel
        {
            WrongScore = "1-1",
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            LogInfoDetail = logInfoDetail,
            ActualScore = "2-2",
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            ScoreId = 3,
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local)
        };

        var models = new List<WrongScoreInfoViewModel> { model, new() };

        // Act
        var actual = models.ToEventWrongScoreXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToEventWrongScoreXml_ModelHasTimeIsNull_ReturnXML()
    {
        // Arrange
        const string expected =
            "<root><r LiveHomeScore='1' LiveAwayScore='1' ScoreId='3' AATime='' PATime='' SATime='' LiveScores='' " +
            "SubIssueTypeId='0' FilterFromTransTime='2018-10-30 16:20:20.222' FilterToTransTime='' VoidFromTime='' " +
            "VoidToTime='' MatchId='0' SingleCount='0' MainParlayCount='0' ActualScore='2-2' FilterBy='' IsCheckedVar='' " +
            "MinTime='' MinType='' /></root>";

        var model = new WrongScoreInfoViewModel
        {
            WrongScore = "1-1",
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            FilterToTransTime = null,
            LogInfoDetail = new LogInfoDetail(),
            ActualScore = "2-2",
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            ScoreId = 3
        };

        var models = new List<WrongScoreInfoViewModel> { model };

        // Act
        var actual = models.ToEventWrongScoreXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToEventWrongScoreXml_FilterByCheckTime_ReturnExpected()
    {
        // Arrange
        const string expected =
            "<root><r LiveHomeScore='' LiveAwayScore='' ScoreId='3' AATime='' PATime='' SATime='' LiveScores='1-1' " +
            "SubIssueTypeId='0' FilterFromTransTime='2018-10-30 16:20:20.222' FilterToTransTime='2018-10-30 16:20:20.222' " +
            "VoidFromTime='' VoidToTime='' MatchId='123' SingleCount='1' MainParlayCount='1' ActualScore='2-2' FilterBy='2' " +
            "IsCheckedVar='' MinTime='2018-10-30 16:20:20.222' MinType='1' /></root>";

        var logInfoDetail = new LogInfoDetail
        {
            MatchId = 123,
            LiveScores = "1-1",
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            SingleCount = 1,
            CashOutCount = 1,
            InstantlySettleCount = 1,
            MainParlayCount = 1,
            HighlightMinTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            HighlightAcceptType = 1
        };
        var model = new WrongScoreInfoViewModel
        {
            WrongScore = "1-1",
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            LogInfoDetail = logInfoDetail,
            ActualScore = "2-2",
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            ScoreId = 3,
            FilterBy = 2
        };

        var models = new List<WrongScoreInfoViewModel> { model };

        // Act
        var actual = models.ToEventWrongScoreXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToEventWrongScoreXml_HasWrongScoreIsNull_ReturnExpected()
    {
        // Arrange
        const string expected =
            "<root><r LiveHomeScore='' LiveAwayScore='' ScoreId='3' AATime='' PATime='' SATime='' LiveScores='1-1' " +
            "SubIssueTypeId='0' FilterFromTransTime='2018-10-30 16:20:20.222' FilterToTransTime='2018-10-30 16:20:20.222' " +
            "VoidFromTime='' VoidToTime='' MatchId='123' SingleCount='1' MainParlayCount='1' ActualScore='2-2' FilterBy='' " +
            "IsCheckedVar='' MinTime='2018-10-30 16:20:20.222' MinType='1' /></root>";
        var logInfoDetail = new LogInfoDetail
        {
            MatchId = 123,
            LiveScores = "1-1",
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            SingleCount = 1,
            CashOutCount = 1,
            InstantlySettleCount = 1,
            MainParlayCount = 1,
            HighlightMinTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            HighlightAcceptType = 1
        };
        var model = new WrongScoreInfoViewModel
        {
            WrongScore = null,
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            LogInfoDetail = logInfoDetail,
            ActualScore = "2-2",
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            ScoreId = 3
        };

        var models = new List<WrongScoreInfoViewModel> { model };

        // Act
        var actual = models.ToEventWrongScoreXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToEventWrongScoreXml_HasLogInfoDetailIsNull_ReturnExpected()
    {
        // Arrange
        const string expected =
            "<root><r LiveHomeScore='' LiveAwayScore='' ScoreId='3' AATime='' PATime='' SATime='' LiveScores='' " +
            "SubIssueTypeId='0' FilterFromTransTime='2018-10-30 16:20:20.222' FilterToTransTime='2018-10-30 16:20:20.222' " +
            "VoidFromTime='' VoidToTime='' MatchId='0' SingleCount='0' MainParlayCount='0' ActualScore='2-2' FilterBy='2' " +
            "IsCheckedVar='' MinTime='' MinType='' /></root>";

        var model = new WrongScoreInfoViewModel
        {
            WrongScore = "1-1",
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            ActualScore = "2-2",
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            ScoreId = 3,
            FilterBy = 2,
            LogInfoDetail = new LogInfoDetail()
        };

        var models = new List<WrongScoreInfoViewModel> { model };

        // Act
        var actual = models.ToEventWrongScoreXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToEventDangerAcceptedXml_HasData_ReturnXML()
    {
        // Arrange
        var expected =
            "<root><r MatchId='123' AATime='' PATime='' SATime='' FilterBy='' IsMainMatch='false' SubIssueTypeId='0' " +
            "LiveScores='1-1' FilterFromTransTime='2018-10-30 16:20:20.222' FilterToTransTime='2018-10-30 16:20:20.222' " +
            "VoidFromTime='2018-10-30 16:20:20.222' VoidToTime='2018-10-30 16:20:20.222' SingleCount='1' MainParlayCount='1' " +
            "IsCheckedVar='' MinTime='2018-10-30 16:20:20.222' MinType='' />" + Environment.NewLine +
            "<r MatchId='0' AATime='' PATime='' SATime='' FilterBy='' IsMainMatch='false' SubIssueTypeId='0' " +
            "LiveScores='' FilterFromTransTime='0001-01-01 00:00:00.000' FilterToTransTime='0001-01-01 00:00:00.000' " +
            "VoidFromTime='' VoidToTime='' SingleCount='' MainParlayCount='' IsCheckedVar='' MinTime='' MinType='' />" +
            Environment.NewLine +
            "<r MatchId='123' AATime='' PATime='' SATime='' FilterBy='' IsMainMatch='false' SubIssueTypeId='0' " +
            "LiveScores='1-1' FilterFromTransTime='2018-10-30 16:20:20.222' FilterToTransTime='2018-10-30 16:20:20.222' " +
            "VoidFromTime='2018-10-30 16:20:20.222' VoidToTime='2018-10-30 16:20:20.222' SingleCount='1' MainParlayCount='1' " +
            "IsCheckedVar='' MinTime='' MinType='' /></root>";

        var logInfoDetail = new LogInfoDetail
        {
            MatchId = 123,
            LiveScores = "1-1",
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            SingleCount = 1,
            CashOutCount = 1,
            InstantlySettleCount = 1,
            MainParlayCount = 1,
            HighlightMinTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local)
        };
        var logInfoDetail2 = new LogInfoDetail
        {
            MatchId = 123,
            LiveScores = "1-1",
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            SingleCount = 1,
            CashOutCount = 1,
            InstantlySettleCount = 1,
            MainParlayCount = 1,
            HighlightMinTime = null
        };

        var model = new DangerAcceptedViewModel
        {
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            LogInfoDetail = logInfoDetail,
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local)
        };

        var model2 = new DangerAcceptedViewModel
        {
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            LogInfoDetail = logInfoDetail2,
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local)
        };

        var models = new List<DangerAcceptedViewModel> { model, new(), model2 };

        // Act
        var actual = models.ToEventDangerAcceptedXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToEventDangerAcceptedXml_HasVoidTimeIsNull_ReturnXML()
    {
        // Arrange
        const string expected =
            "<root><r MatchId='123' AATime='' PATime='' SATime='' FilterBy='' IsMainMatch='false' "
            + "SubIssueTypeId='0' LiveScores='1-1' FilterFromTransTime='2018-10-30 16:20:20.222' "
            + "FilterToTransTime='2018-10-30 16:20:20.222' VoidFromTime='' VoidToTime='' SingleCount='1' "
            + "MainParlayCount='1' IsCheckedVar='' MinTime='' MinType='' /></root>";
        var logInfoDetail = new LogInfoDetail
        {
            MatchId = 123,
            LiveScores = "1-1",
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            SingleCount = 1,
            CashOutCount = 1,
            InstantlySettleCount = 1,
            MainParlayCount = 1
        };
        var model = new DangerAcceptedViewModel
        {
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            LogInfoDetail = logInfoDetail,
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local)
        };

        var models = new List<DangerAcceptedViewModel> { model };

        // Act
        var actual = models.ToEventDangerAcceptedXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToEventDangerAcceptedXml_HasLogInfoDetail_ReturnExpected()
    {
        // Arrange
        const string expected =
            "<root><r MatchId='123' AATime='' PATime='' SATime='' FilterBy='' IsMainMatch='false' "
            + "SubIssueTypeId='0' LiveScores='' FilterFromTransTime='2018-10-30 16:20:20.222' "
            + "FilterToTransTime='2018-10-30 16:20:20.222' VoidFromTime='' VoidToTime='' SingleCount='' "
            + "MainParlayCount='' IsCheckedVar='' MinTime='' MinType='' /></root>";

        var model = new DangerAcceptedViewModel
        {
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            LogInfoDetail = null,
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local)
        };

        var models = new List<DangerAcceptedViewModel> { model };

        // Act
        var actual = models.ToEventDangerAcceptedXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToEventDangerAcceptedXml_HasNoData_ReturnEmpty()
    {
        // Arrange
        var models = new List<DangerAcceptedViewModel>();

        // Act
        var actual = models.ToEventDangerAcceptedXml();

        // Assert
        Assert.Empty(actual);
    }

    [Fact]
    public void ToEventWrongHdpXml_HasNoData_ReturnEmpty()
    {
        // Arrange
        var models = new List<WrongHdpViewModel>();

        // Act
        var actual = models.ToEventWrongHdpXml();

        // Assert
        Assert.Empty(actual);
    }

    [Fact]
    public void ToEventWrongOuXml_HasNoData_ReturnEmpty()
    {
        // Arrange
        var models = new List<WrongOuViewModel>();

        // Act
        var actual = models.ToEventWrongOuXml();

        // Assert
        Assert.Empty(actual);
    }

    [Fact]
    public void ToEventWrongHdpXml_HasData_ReturnXML()
    {
        // Arrange
        const string expected = "<root><r MatchId='123' LiveScores='1-1' IsMainMatch='false' SubIssueTypeId='0' " +
                                "FilterFromTransTime='2018-10-30 16:20:20.222' FilterToTransTime='2018-10-30 16:20:20.222' IsLinkGroup1X2='False' " +
                                "IsLinkGroupAIO ='False' LiveGameEarlySingleCount ='0' LiveGameEarlyCashOutCount='0' LiveGameEarlySettleCount='0' " +
                                "LiveGameEarlyInstantlySettleCount='0' PoolHouseSingleCount='0' PoolHouseCashOutCount='0' PoolHouseMainParlayCount='0' " +
                                "PoolHouseInstantlySettleCount='0' PoolHouseCheckedBetTypes='' VoidFromTime='2018-10-30 16:20:20.222' VoidToTime='2018-10-30 16:20:20.222' " +
                                "LiveIndicator='0' HomeFavorite='' AwayFavorite='' ActualMarket='' HdpValue='' /></root>";
        var logInfoDetail = new LogInfoDetail
        {
            MatchId = 123,
            LiveScores = "1-1",
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            SingleCount = 1,
            CashOutCount = 1,
            InstantlySettleCount = 1,
            MainParlayCount = 1
        };
        var model = new WrongHdpViewModel
        {
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            LogInfoDetail = logInfoDetail,
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local)
        };

        var models = new List<WrongHdpViewModel> { model };

        // Act
        var actual = models.ToEventWrongHdpXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToEventWrongHdpXml_HasLogInfoDetailIsNull_ReturnXML()
    {
        // Arrange
        const string expected = "<root><r MatchId='123' LiveScores='' IsMainMatch='false' SubIssueTypeId='0' " +
                                "FilterFromTransTime='2018-10-30 16:20:20.222' FilterToTransTime='2018-10-30 16:20:20.222' IsLinkGroup1X2='False' " +
                                "IsLinkGroupAIO ='False' LiveGameEarlySingleCount ='' LiveGameEarlyCashOutCount='' LiveGameEarlySettleCount='' " +
                                "LiveGameEarlyInstantlySettleCount='' PoolHouseSingleCount='' PoolHouseCashOutCount='' PoolHouseMainParlayCount='' " +
                                "PoolHouseInstantlySettleCount='' PoolHouseCheckedBetTypes='' VoidFromTime='' VoidToTime='' " +
                                "LiveIndicator='0' HomeFavorite='' AwayFavorite='' ActualMarket='' HdpValue='' /></root>";

        var model = new WrongHdpViewModel
        {
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            LogInfoDetail = null,
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local)
        };

        var models = new List<WrongHdpViewModel> { model };

        // Act
        var actual = models.ToEventWrongHdpXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToEventWrongOuXml_HasData_ReturnXML()
    {
        // Arrange
        const string expected = "<root><r MatchId='123' LiveScores='1-1' IsMainMatch='false' SubIssueTypeId='0' " +
                                "FilterToTransTime='2018-10-30 16:20:20.222' FilterFromTransTime='2018-10-30 16:20:20.222' " +
                                "IsLinkGroup1X2='False' IsLinkGroupAIO ='False' LiveGameEarlySingleCount ='0' LiveGameEarlyCashOutCount='0' " +
                                "LiveGameEarlySettleCount='0' LiveGameEarlyInstantlySettleCount='0' PoolHouseSingleCount='0' " +
                                "PoolHouseCashOutCount='0' PoolHouseMainParlayCount='0' PoolHouseInstantlySettleCount='0' " +
                                "PoolHouseCheckedBetTypes='' VoidToTime='2018-10-30 16:20:20.222' VoidFromTime='2018-10-30 16:20:20.222' " +
                                "LiveIndicator='0' ActualMarket='' WrongMarket='' /></root>";
        var logInfoDetail = new LogInfoDetail
        {
            MatchId = 123,
            LiveScores = "1-1",
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            SingleCount = 1,
            CashOutCount = 1,
            InstantlySettleCount = 1,
            MainParlayCount = 1
        };
        var model = new WrongOuViewModel
        {
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            LogInfoDetail = logInfoDetail,
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local)
        };

        var models = new List<WrongOuViewModel> { model };

        // Act
        var actual = models.ToEventWrongOuXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToEventWrongOuXml_HasLogInfoDetailIsNull_ReturnExpected()
    {
        // Arrange
        const string expected = "<root><r MatchId='123' LiveScores='' IsMainMatch='false' SubIssueTypeId='0' " +
                                "FilterToTransTime='2018-10-30 16:20:20.222' FilterFromTransTime='2018-10-30 16:20:20.222' " +
                                "IsLinkGroup1X2='False' IsLinkGroupAIO ='False' LiveGameEarlySingleCount ='' " +
                                "LiveGameEarlyCashOutCount='' LiveGameEarlySettleCount='' LiveGameEarlyInstantlySettleCount='' " +
                                "PoolHouseSingleCount='' PoolHouseCashOutCount='' PoolHouseMainParlayCount='' PoolHouseInstantlySettleCount='' " +
                                "PoolHouseCheckedBetTypes='' VoidToTime='' VoidFromTime='' LiveIndicator='0' ActualMarket='' WrongMarket='' /></root>";

        var model = new WrongOuViewModel
        {
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local),
            LogInfoDetail = null,
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222, DateTimeKind.Local)
        };

        var models = new List<WrongOuViewModel> { model };

        // Act
        var actual = models.ToEventWrongOuXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToAbnormalAccountXml_HasData_ReturnXMLExpected()
    {
        // Arrange
        var model = new AbnormalAccountViewModel
        {
            AccountWinlostModels = new List<AccountWinlostModel>(),
            ProductIds = "p1",
            StatusIds = "1",
            FromDate = new DateTime(2018, 10, 30, 16, 20, 20, DateTimeKind.Local),
            ToDate = new DateTime(2018, 10, 30, 16, 20, 20, DateTimeKind.Local)
        };
        const string expected = "<root><r Usernames='' "
                                + "ProductIds='p1' "
                                + "StatusIds='1' "
                                + "FromDate='10/30/2018 16:20:20' "
                                + "ToDate='10/30/2018 16:20:20' /></root>";

        // Act
        var actual = model.ToAbnormalAccountXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToAbnormalAccountXml_HasDateIsNull_ReturnXMLExpected()
    {
        // Arrange
        var model = new AbnormalAccountViewModel
        {
            AccountWinlostModels = new List<AccountWinlostModel>(),
            ProductIds = "p1",
            StatusIds = "1",
            FromDate = null,
            ToDate = null
        };
        const string expected = "<root><r Usernames='' "
                                + "ProductIds='p1' "
                                + "StatusIds='1' "
                                + "FromDate='' "
                                + "ToDate='' /></root>";

        // Act
        var actual = model.ToAbnormalAccountXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToRequestInfoGetVoidedTicketXml_HasRequest_ReturnXML()
    {
        // Arrange
        var requests = new List<GetRequestInfoModel>
        {
            new()
            {
                RequestId = 1,
                VoidingHistoryId = 2,
                IssueTypeId = 3,
                MatchId = 4
            }
        };
        const string expected = "<root><r req='1' vh='2' i='3' mid='4'/></root>";

        // Act
        var actual = requests.ToRequestInfoGetVoidedTicketXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToRequestInfoGetVoidedTicketXml_RequestEmpty_ReturnEmpty()
    {
        // Arrange
        var requests = new List<GetRequestInfoModel>();

        // Act
        var actual = requests.ToRequestInfoGetVoidedTicketXml();

        // Assert
        Assert.Empty(actual);
    }

    [Fact]
    public void ToWrongOddsInfoXml_HasNotRequest_ReturnEmpty()
    {
        // Arrange

        // Act
        var actual = new List<WrongOddsViewModel>().ToWrongOddsInfoXml();

        // Assert
        Assert.Equal("", actual);
    }

    [Fact]
    public void ToWrongOddsInfoXml_HasRequest_ReturnExpected()
    {
        // Arrange
        var models = new List<WrongOddsViewModel> { new() { MatchId = 1 } };
        const string expected =
            "<root><r MatchId='1' FilterFromTransTime='0001-01-01 00:00:00.000' FilterToTransTime='0001-01-01 00:00:00.000' "
            + "SubIssueTypeId='0' LiveIndicator='0' FilterOddsType='' FilterFavoriteType='' FilterOuType='' OddsValue='' FromOdds='' "
            + "ToOdds='' CorrectOdds='' BetTeam='' OuValue='' FavoriteValue='' PoolHouseCheckedBetTypes='' IsLinkGroup1X2='False' "
            + "IsLinkGroupAIO ='False' /></root>";

        // Act
        var actual = models.ToWrongOddsInfoXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToWrongOuInfoXml_HasNotRequest_ReturnEmpty()
    {
        // Arrange

        // Act
        var actual = new List<WrongOuViewModel>().ToWrongOuInfoXml();

        // Assert
        Assert.Equal("", actual);
    }

    [Fact]
    public void ToWrongOuInfoXml_HasRequest_ReturnExpected()
    {
        // Arrange
        var models = new List<WrongOuViewModel> { new() { MatchId = 1 } };
        const string expected =
            "<root><r MatchId='1' FilterFromTransTime='0001-01-01 00:00:00.000' FilterToTransTime='0001-01-01 00:00:00.000' " +
            "SubIssueTypeId='0' IsMainMatch='False' LiveIndicator='0' PoolHouseCheckedBetTypes='' " +
            "IsLinkGroup1X2='False' IsLinkGroupAIO ='False' WrongMarket='' /></root>";

        // Act
        var actual = models.ToWrongOuInfoXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToWrongHdpInfoXml_HasNotRequest_ReturnEmpty()
    {
        // Arrange

        // Act
        var actual = new List<WrongHdpViewModel>().ToWrongHdpInfoXml();

        // Assert
        Assert.Equal("", actual);
    }

    [Fact]
    public void ToWrongHdpInfoXml_HasRequest_ReturnExpected()
    {
        // Arrange
        var models = new List<WrongHdpViewModel> { new() { MatchId = 1 } };
        const string expected =
            "<root><r MatchId='1' FilterFromTransTime='0001-01-01 00:00:00.000' FilterToTransTime='0001-01-01 00:00:00.000' " +
            "IsMainMatch='False' PoolHouseCheckedBetTypes='' SubIssueTypeId='0' IsLinkGroup1X2='False' IsLinkGroupAIO ='False' " +
            "LiveIndicator='0' HomeFavorite='' AwayFavorite='' HdpValue='' /></root>";

        // Act
        var actual = models.ToWrongHdpInfoXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToDangerAcceptedInfoXml_HasNotRequest_ReturnEmpty()
    {
        // Arrange

        // Act
        var actual = new List<DangerAcceptedViewModel>().ToDangerAcceptedInfoXml();

        // Assert
        Assert.Equal("", actual);
    }

    [Fact]
    public void ToDangerAcceptedInfoXml_HasRequest_ReturnExpected()
    {
        // Arrange
        var models = new List<DangerAcceptedViewModel> { new() { MatchId = 1 } };
        const string expected = "<root><r MatchId='1' FilterFromTransTime='0001-01-01 00:00:00.000' "
                                + "FilterToTransTime='0001-01-01 00:00:00.000' SubIssueTypeId='0' AATime='' PATime='' SATime='' FilterBy=''/></root>";

        // Act
        var actual = models.ToDangerAcceptedInfoXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToWrongScoreInfoXml_HasNotRequest_ReturnEmpty()
    {
        // Arrange

        // Act
        var actual = new List<WrongScoreInfoViewModel>().ToWrongScoreInfoXml();

        // Assert
        Assert.Equal("", actual);
    }

    [Fact]
    public void ToWrongScoreInfoXml_HasWrongScoreNotNull_ReturnExpected()
    {
        // Arrange
        var models = new List<WrongScoreInfoViewModel> { new() { MatchId = 1, WrongScore = "123-456" } };
        const string expected =
            "<root><r LiveHomeScore='123' LiveAwayScore='456' FilterFromTransTime='0001-01-01 00:00:00.000' "
            + "ScoreId='0' FilterToTransTime='' SubIssueTypeId='0' MatchId='1' AATime='' PATime='' SATime='' FilterBy=''/></root>";

        // Act
        var actual = models.ToWrongScoreInfoXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToWrongScoreInfoXml_HasWrongScoreNull_ReturnExpected()
    {
        // Arrange
        var models = new List<WrongScoreInfoViewModel> { new() { MatchId = 1, WrongScore = null } };
        const string expected =
            "<root><r LiveHomeScore='' LiveAwayScore='' FilterFromTransTime='0001-01-01 00:00:00.000' "
            + "ScoreId='0' FilterToTransTime='' SubIssueTypeId='0' MatchId='1' AATime='' PATime='' SATime='' FilterBy=''/></root>";

        // Act
        var actual = models.ToWrongScoreInfoXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToWrongScoreInfoXml_HasFilterByIsFilterByCheckTime_ReturnExpected()
    {
        // Arrange
        var models = new List<WrongScoreInfoViewModel> { new() { FilterBy = 2, MatchId = 1, WrongScore = null } };
        const string expected =
            "<root><r LiveHomeScore='' LiveAwayScore='' FilterFromTransTime='0001-01-01 00:00:00.000' "
            + "ScoreId='0' FilterToTransTime='' SubIssueTypeId='0' MatchId='1' AATime='' PATime='' SATime='' FilterBy='2'/></root>";

        // Act
        var actual = models.ToWrongScoreInfoXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToReducedOverInfoXml_HasReducedOverViewModelIsArrayEmpty_ReturnStringEmpty()
    {
        // Arrange
        var models = new List<ReducedOverViewModel>();

        // Act
        var actual = models.ToReducedOverInfoXml();

        // Assert
        Assert.Equal(string.Empty, actual);
    }

    [Fact]
    public void ToNotParticipateInfoXml_HasParticipateViewModelIsArrayEmpty_ReturnStringEmpty()
    {
        // Arrange
        var models = new List<NotParticipateViewModel>();

        // Act
        var actual = models.ToNotParticipateInfoXml();

        // Assert
        Assert.Equal(string.Empty, actual);
    }

    [Fact]
    public void ToReducedOverInfoXml_ReducedOverViewModelHasData_ReturnStringExpected()
    {
        // Arrange
        var models = new List<ReducedOverViewModel> { new() };
        const string expected =
            "<root><r MatchId='0' SubIssueTypeId='0' BetTypeIds='' WicketOver='' FilterWicketOver='' " +
            "PlayerIds='' Runs='' NonLive='False' Live='False' /></root>";

        // Act
        var actual = models.ToReducedOverInfoXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToNotParticipateInfoXml_NotParticipateViewModelHasData_ReturnStringExpected()
    {
        // Arrange
        var models = new List<NotParticipateViewModel> { new() };
        const string expected = "<root><r MatchId='0' SubIssueTypeId='0' PlayerId='0' GroupBetTypeIds='' /></root>";

        // Act
        var actual = models.ToNotParticipateInfoXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void OperatorToXml_OperatorQueryIsNull_ReturnEmpty()
    {
        // Arrange

        // Act
        var actual = ((List<OperatorQuery>)null).OperatorToXml();

        // Assert
        Assert.Equal("", actual);
    }

    [Fact]
    public void OperatorToXml_ValidData_ReturnExpected()
    {
        // Arrange
        var operators = new List<OperatorQuery> { new() { OperatorId = 1, OperatorType = 1 } };

        // Act
        var actual = operators.OperatorToXml();

        // Assert
        Assert.Equal("<r OperatorId=\"1\" Type=\"1\" />", actual);
    }

    [Fact]
    public void ToEventReducedOverXml_ReducedOverViewModelIsNull_ReturnEmpty()
    {
        // Arrange
        var models = new List<ReducedOverViewModel>();

        // Act
        var actual = models.ToEventReducedOverXml();

        // Assert
        Assert.Equal("", actual);
    }

    [Fact]
    public void ToEventNotParticipateXml_NotParticipateViewModelIsNull_ReturnEmpty()
    {
        // Arrange
        var models = new List<NotParticipateViewModel>();

        // Act
        var actual = models.ToEventNotParticipateXml();

        // Assert
        Assert.Equal("", actual);
    }

    [Fact]
    public void ToEventReducedOverXml_HasReducedOverViewModel_ReturnExpected()
    {
        // Arrange
        var models = new List<ReducedOverViewModel>
        {
            new()
            {
                MatchId = 1,
                SubIssueTypeId = 1,
                BetTypeIds = "1",
                WicketOver = "1",
                FilterWicketOver = "1",
                PlayerIds = "1",
                Runs = "1",
                Live = true,
                NonLive = false,
                LogInfoDetail = new LogInfoDetail
                {
                    SingleCount = 1,
                    MainParlayCount = 1,
                    VoidToTime = new DateTime(2022, 2, 2, 2, 2, 2),
                    VoidFromTime = new DateTime(2022, 2, 2, 2, 2, 2)
                }
            }
        };

        const string expected = "<root><r MatchId='1' "
                                + "SubIssueTypeId='1' "
                                + "BetTypeIds='1' "
                                + "WicketOver='1' "
                                + "FilterWicketOver='1' "
                                + "PlayerIds='1' "
                                + "Runs='1' "
                                + "Live='True' "
                                + "NonLive='False' "
                                + "SingleCount ='1' "
                                + "MainParlayCount='1' "
                                + "VoidToTime='2022-02-02 02:02:02.000' "
                                + "VoidFromTime='2022-02-02 02:02:02.000' /></root>";
        // Act
        var actual = models.ToEventReducedOverXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToEventNotParticipateXml_HasNotParticipateViewModel_ReturnExpected()
    {
        // Arrange
        var models = new List<NotParticipateViewModel>
        {
            new()
            {
                MatchId = 1,
                SubIssueTypeId = 1,
                GroupBetTypeIds = "1",
                LogInfoDetail = new LogInfoDetail
                {
                    SingleCount = 1,
                    MainParlayCount = 1,
                    VoidToTime = new DateTime(2022, 2, 2, 2, 2, 2),
                    VoidFromTime = new DateTime(2022, 2, 2, 2, 2, 2)
                }
            }
        };

        const string expected = "<root><r MatchId='1' SubIssueTypeId='1' PlayerId='0' GroupBetTypeIds='1' SingleCount ='1' MainParlayCount='1' " +
                                "VoidToTime='2022-02-02 02:02:02.000' VoidFromTime='2022-02-02 02:02:02.000' /></root>";

        // Act
        var actual = models.ToEventNotParticipateXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToEventWrongOddsXml_WrongOddsViewModelIsNoValue_ReturnEmpty()
    {
        // Arrange
        var models = new List<WrongOddsViewModel>();

        // Act
        var actual = models.ToEventWrongOddsXml();

        // Assert
        Assert.Equal("", actual);
    }

    [Fact]
    public void ToEventWrongOddsXml_WrongOddsViewModelHasValue_ReturnExpected()
    {
        // Arrange
        var models = new List<WrongOddsViewModel>
        {
            new()
            {
                MatchId = 1,
                SubIssueTypeId = 1,
                FilterToTransTime = new DateTime(2022, 2, 2, 2, 2, 2),
                FilterFromTransTime = new DateTime(2022, 2, 2, 2, 2, 2),
                IsLinkGroup1X2 = true,
                IsLinkGroupAIO = false,
                PoolHouseCheckedBetTypes = "1",
                LiveIndicator = 1,
                FilterOddsType = "1",
                FilterFavoriteType = "1",
                FilterOuType = "1",
                OddsValue = "1",
                FromOdds = "1",
                ToOdds = "1",
                CorrectOdds = "1",
                BetTeam = "1",
                OuValue = "1",
                FavoriteValue = "1",
                LogInfoDetail = new LogInfoDetail
                {
                    LiveScores = "1",
                    LiveGameEarlySingleCount = 1,
                    LiveGameEarlyCashOutCount = 1,
                    LiveGameEarlySettleCount = 1,
                    LiveGameEarlyInstantlySettleCount = 1,
                    PoolHouseSingleCount = 1,
                    PoolHouseCashOutCount = 1,
                    PoolHouseMainParlayCount = 1,
                    PoolHouseInstantlySettleCount = 1,
                    VoidToTime = new DateTime(2022, 2, 2, 2, 2, 2),
                    VoidFromTime = new DateTime(2022, 2, 2, 2, 2, 2)
                }
            }
        };

        const string expected = "<root><r MatchId='1' "
                                + "LiveScores='1' "
                                + "SubIssueTypeId='1' "
                                + "FilterToTransTime='2022-02-02 02:02:02.000' "
                                + "FilterFromTransTime='2022-02-02 02:02:02.000' "
                                + "IsLinkGroup1X2='True' "
                                + "IsLinkGroupAIO ='False' "
                                + "LiveGameEarlySingleCount ='1' "
                                + "LiveGameEarlyCashOutCount='1' "
                                + "LiveGameEarlySettleCount='1' "
                                + "LiveGameEarlyInstantlySettleCount='1' "
                                + "PoolHouseSingleCount='1' "
                                + "PoolHouseCashOutCount='1' "
                                + "PoolHouseMainParlayCount='1' "
                                + "PoolHouseInstantlySettleCount='1' "
                                + "PoolHouseCheckedBetTypes='1' "
                                + "VoidToTime='2022-02-02 02:02:02.000' "
                                + "VoidFromTime='2022-02-02 02:02:02.000' "
                                + "LiveIndicator='1' "
                                + "FilterOddsType='1' "
                                + "FilterFavoriteType='1' "
                                + "FilterOuType='1' "
                                + "OddsValue='1' "
                                + "FromOdds='1' "
                                + "ToOdds='1' "
                                + "CorrectOdds='1' "
                                + "BetTeam='1' "
                                + "OuValue='1' "
                                + "FavoriteValue='1' /></root>";
        // Act
        var actual = models.ToEventWrongOddsXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToEventKickOffXml_HasDataViewModel_ReturnExpected()
    {
        // Arrange
        var models = new List<EarlyKickOffViewModel>
        {
            new()
            {
                MatchId = 1, IsMainMatch = true, SubIssueTypeId = 1, KickOffTime = new DateTime(2023, 3, 3, 3, 3, 3, 3)
            }
        };
        const string expected =
            "<root><r MatchId='1' IsMainMatch='true' SubIssueTypeId='1' KickOffTime='03/02/2023 15:03:03'/></root>";

        // Act
        var actual = models.ToEventKickOffXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToEventKickOffXml_NoHasKickOffTimeInDataViewModel_ReturnExpected()
    {
        // Arrange
        var models = new List<EarlyKickOffViewModel>
        {
            new()
            {
                MatchId = 1, IsMainMatch = true, SubIssueTypeId = 1
            }
        };
        const string expected = "<root><r MatchId='1' IsMainMatch='true' SubIssueTypeId='1' KickOffTime=''/></root>";

        // Act
        var actual = models.ToEventKickOffXml();

        // Assert
        Assert.Equal(expected, actual);
    }
}