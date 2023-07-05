using System;
using System.Collections.Generic;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Extension;

public class ObjectToXMLExtensionFacts
{
	[Fact]
	public void ToRequestXml_HasRequest_ReturnXML()
	{
		// Arrange
		var expected = $"<Requests><Request RequestId='1002' TransIds='12' /></Requests>";

		var model = new List<RequestXMLModel>
			{
				new RequestXMLModel { RequestId = 1002, TransIds = "12" }
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
		var expected = $"<RequestId Id='1' />\r\n<RequestId Id='2' />";

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
        var expected = $"<RequestId Id='1' />";

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
        var model = new List<int> ();

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
		const string expected =
			"<root><r LiveHomeScore='1' LiveAwayScore='1' ScoreId='3' AATime='' PATime='' SATime='' "
			+ "LiveScores='1-1' SubIssueTypeId='0' FilterFromTransTime='2018-10-30 16:20:20.222' "
			+ "FilterToTransTime='2018-10-30 16:20:20.222' VoidFromTime='2018-10-30 16:20:20.222' VoidToTime='2018-10-30 16:20:20.222' MatchId='123' SingleCount='1' "
        + "MainParlayCount='1' ActualScore='2-2' FilterBy='' IsCheckedVar='' /></root>";
		var logInfoDetail = new LogInfoDetail
		{
			MatchId = 123,
			LiveScores = "1-1",
			VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			SingleCount = 1,
			CashOutCount = 1,
			InstantlySettleCount = 1,
			MainParlayCount = 1
		};
		var model = new WrongScoreInfoViewModel
		{
			WrongScore = "1-1",
			FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			LogInfoDetail = logInfoDetail,
			ActualScore = "2-2",
			MatchId = 123,
			EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			ScoreId = 3,
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222)
        };

		var models = new List<WrongScoreInfoViewModel> { model };

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
            "<root><r LiveHomeScore='1' LiveAwayScore='1' ScoreId='3' AATime='' PATime='' SATime='' "
            + "LiveScores='1-1' SubIssueTypeId='0' FilterFromTransTime='2018-10-30 16:20:20.222' "
            + "FilterToTransTime='' VoidFromTime='' VoidToTime='' MatchId='123' SingleCount='1' "
        + "MainParlayCount='1' ActualScore='2-2' FilterBy='' IsCheckedVar='' /></root>";
        var logInfoDetail = new LogInfoDetail
        {
            MatchId = 123,
            LiveScores = "1-1",
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            SingleCount = 1,
            CashOutCount = 1,
            InstantlySettleCount = 1,
            MainParlayCount = 1
        };
        var model = new WrongScoreInfoViewModel
        {
            WrongScore = "1-1",
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            FilterToTransTime = null,
            LogInfoDetail = logInfoDetail,
            ActualScore = "2-2",
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            ScoreId = 3,
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
			"<root><r LiveHomeScore='' LiveAwayScore='' ScoreId='3' AATime='' PATime='' SATime='' LiveScores='1-1' "
			+ "SubIssueTypeId='0' FilterFromTransTime='2018-10-30 16:20:20.222' FilterToTransTime='2018-10-30 16:20:20.222' "
								+ "VoidFromTime='' VoidToTime='' MatchId='123' SingleCount='1' MainParlayCount='1' ActualScore='2-2' FilterBy='2' "
								+ "IsCheckedVar='' /></root>";
		var logInfoDetail = new LogInfoDetail
		{
			MatchId = 123,
			LiveScores = "1-1",
			VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			SingleCount = 1,
			CashOutCount = 1,
			InstantlySettleCount = 1,
			MainParlayCount = 1,
			HighlightMinTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			HighlightAcceptType = 1
		};
		var model = new WrongScoreInfoViewModel
		{
			WrongScore = "1-1",
			FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			LogInfoDetail = logInfoDetail,
			ActualScore = "2-2",
			MatchId = 123,
			EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222),
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
            "<root><r LiveHomeScore='' LiveAwayScore='' ScoreId='3' AATime='' PATime='' SATime='' LiveScores='1-1' "
            + "SubIssueTypeId='0' FilterFromTransTime='2018-10-30 16:20:20.222' FilterToTransTime='2018-10-30 16:20:20.222' "
                                + "VoidFromTime='' VoidToTime='' MatchId='123' SingleCount='1' MainParlayCount='1' ActualScore='2-2' FilterBy='' "
                                + "IsCheckedVar='' /></root>";
        var logInfoDetail = new LogInfoDetail
        {
            MatchId = 123,
            LiveScores = "1-1",
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            SingleCount = 1,
            CashOutCount = 1,
            InstantlySettleCount = 1,
            MainParlayCount = 1,
            HighlightMinTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            HighlightAcceptType = 1
        };
        var model = new WrongScoreInfoViewModel
        {
            WrongScore = null,
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            LogInfoDetail = logInfoDetail,
            ActualScore = "2-2",
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            ScoreId = 3,
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
            "<root><r LiveHomeScore='' LiveAwayScore='' ScoreId='3' AATime='' PATime='' SATime='' LiveScores='' "
            + "SubIssueTypeId='0' FilterFromTransTime='2018-10-30 16:20:20.222' FilterToTransTime='2018-10-30 16:20:20.222' "
                                + "VoidFromTime='' VoidToTime='' MatchId='' SingleCount='' MainParlayCount='' ActualScore='2-2' FilterBy='2' "
                                + "IsCheckedVar='' /></root>";
        
        var model = new WrongScoreInfoViewModel
        {
            WrongScore = "1-1",
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            ActualScore = "2-2",
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222),
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
	public void ToEventDangerAcceptedXml_HasData_ReturnXML()
	{
		// Arrange
		const string expected =
			"<root><r MatchId='123' AATime='' PATime='' SATime='' FilterBy='' IsMainMatch='false' "
			+ "SubIssueTypeId='0' LiveScores='1-1' FilterFromTransTime='2018-10-30 16:20:20.222' "
			+ "FilterToTransTime='2018-10-30 16:20:20.222' VoidFromTime='2018-10-30 16:20:20.222' VoidToTime='2018-10-30 16:20:20.222' SingleCount='1' "
                                + "MainParlayCount='1' IsCheckedVar='' /></root>";
		var logInfoDetail = new LogInfoDetail
		{
			MatchId = 123,
			LiveScores = "1-1",
			VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			SingleCount = 1,
			CashOutCount = 1,
			InstantlySettleCount = 1,
			MainParlayCount = 1
		};
		var model = new DangerAcceptedViewModel
		{
			FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			LogInfoDetail = logInfoDetail,
			MatchId = 123,
			EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222)
        };

		var models = new List<DangerAcceptedViewModel> { model };

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
                                + "MainParlayCount='1' IsCheckedVar='' /></root>";
        var logInfoDetail = new LogInfoDetail
        {
            MatchId = 123,
            LiveScores = "1-1",
            VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            SingleCount = 1,
            CashOutCount = 1,
            InstantlySettleCount = 1,
            MainParlayCount = 1
        };
        var model = new DangerAcceptedViewModel
        {
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            LogInfoDetail = logInfoDetail,
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222),
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
                                + "MainParlayCount='' IsCheckedVar='' /></root>";
       
        var model = new DangerAcceptedViewModel
        {
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            LogInfoDetail = null,
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222),
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
			VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			SingleCount = 1,
			CashOutCount = 1,
			InstantlySettleCount = 1,
			MainParlayCount = 1
		};
		var model = new WrongHdpViewModel
		{
			FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			LogInfoDetail = logInfoDetail,
			MatchId = 123,
			EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222),
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
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            LogInfoDetail = null,
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222),
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
		const string expected = "<root><r MatchId='123' LiveScores='1-1' IsMainMatch='false' SubIssueTypeId='0' "
		+ "FilterToTransTime='2018-10-30 16:20:20.222' FilterFromTransTime='2018-10-30 16:20:20.222' SingleCount='1' "
		+ "MainParlayCount='1' VoidToTime='2018-10-30 16:20:20.222' VoidFromTime='2018-10-30 16:20:20.222' ActualMarket='' WrongMarket='' /></root>";
		var logInfoDetail = new LogInfoDetail
		{
			MatchId = 123,
			LiveScores = "1-1",
			VoidFromTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			VoidToTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			SingleCount = 1,
			CashOutCount = 1,
			InstantlySettleCount = 1,
			MainParlayCount = 1
		};
		var model = new WrongOuViewModel
		{
			FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			LogInfoDetail = logInfoDetail,
			MatchId = 123,
			EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222),
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
        const string expected = "<root><r MatchId='123' LiveScores='' IsMainMatch='false' SubIssueTypeId='0' "
        + "FilterToTransTime='2018-10-30 16:20:20.222' FilterFromTransTime='2018-10-30 16:20:20.222' SingleCount='' "
        + "MainParlayCount='' VoidToTime='' VoidFromTime='' ActualMarket='' WrongMarket='' /></root>";
        
        var model = new WrongOuViewModel
        {
            FilterFromTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            FilterToTransTime = new DateTime(2018, 10, 30, 16, 20, 20, 222),
            LogInfoDetail = null,
            MatchId = 123,
            EventDate = new DateTime(2018, 10, 30, 16, 20, 20, 222),
        };

        var models = new List<WrongOuViewModel> { model };

        // Act
        var actual = models.ToEventWrongOuXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
	public void ToAbnormalAccountXml_HasData_ReturnXML()
	{
		// Arrange
		var model = new AbnormalAccountViewModel
		{
			Usernames = "a",
			ProductIds = "p1",
			StatusIds = "1",
			FromDate = new DateTime(2018, 10, 30, 16, 20, 20, 222),
			ToDate = new DateTime(2018, 10, 30, 16, 20, 20, 222),
		};
		const string expected = "<root><r Usernames='a' "
								+ "ProductIds='p1' "
								+ "StatusIds='1' "
								+ "FromDate='10/30/2018 4:20:20 PM' "
								+ "ToDate='10/30/2018 4:20:20 PM' /></root>";

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
				new GetRequestInfoModel
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
	public void GetKickOffInfoXml_HasRequest_ReturnExpected()
	{
		// Arrange
		const string expected = "<root><r MatchId='1' KickOffTime='10/30/2018 4:20:20 PM'/></root>";

		// Act
		var actual = ObjectToXMLExtension.GetKickOffInfoXml(1, new DateTime(2018, 10, 30, 16, 20, 20, 222));

		// Assert
		Assert.Equal(expected, actual);
	}

	[Fact]
	public void ToWrongOddsInfoXml_HasNotRequest_ReturnEmpty()
	{
		// Arrange

		// Act
		var actual = (new List<WrongOddsViewModel>()).ToWrongOddsInfoXml();

		// Assert
		Assert.Equal("", actual);
	}

	[Fact]
	public void ToWrongOddsInfoXml_HasRequest_ReturnExpected()
	{
		// Arrange
		var models = new List<WrongOddsViewModel> { new WrongOddsViewModel { MatchId = 1 } };
		const string expected = "<root><r MatchId='1' FilterFromTransTime='0001-01-01 00:00:00.000' FilterToTransTime='0001-01-01 00:00:00.000' "
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
		var actual = (new List<WrongOuViewModel>()).ToWrongOuInfoXml();

		// Assert
		Assert.Equal("", actual);
	}

	[Fact]
	public void ToWrongOuInfoXml_HasRequest_ReturnExpected()
	{
		// Arrange
		var models = new List<WrongOuViewModel> { new WrongOuViewModel { MatchId = 1 } };
		const string expected = "<root><r MatchId='1' FilterFromTransTime='0001-01-01 00:00:00.000' FilterToTransTime='0001-01-01 00:00:00.000' "
		+ "SubIssueTypeId='0' WrongMarket='' /></root>";

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
		var actual = (new List<WrongHdpViewModel>()).ToWrongHdpInfoXml();

		// Assert
		Assert.Equal("", actual);
	}

	[Fact]
	public void ToWrongHdpInfoXml_HasRequest_ReturnExpected()
	{
		// Arrange
		var models = new List<WrongHdpViewModel> { new WrongHdpViewModel { MatchId = 1 } };
		const string expected = "<root><r MatchId='1' FilterFromTransTime='0001-01-01 00:00:00.000' FilterToTransTime='0001-01-01 00:00:00.000' "
		+ "IsMainMatch='False' PoolHouseCheckedBetTypes='' SubIssueTypeId='0' IsLinkGroup1X2='False' IsLinkGroupAIO ='False' "
		+ "IsShowPHOnly ='False' LiveIndicator='0' HomeFavorite='' AwayFavorite='' HdpValue='' /></root>"
;

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
		var actual = (new List<DangerAcceptedViewModel>()).ToDangerAcceptedInfoXml();

		// Assert
		Assert.Equal("", actual);
	}

	[Fact]
	public void ToDangerAcceptedInfoXml_HasRequest_ReturnExpected()
	{
		// Arrange
		var models = new List<DangerAcceptedViewModel> { new DangerAcceptedViewModel { MatchId = 1 } };
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
		var actual = (new List<WrongScoreInfoViewModel>()).ToWrongScoreInfoXml();

		// Assert
		Assert.Equal("", actual);
	}

	[Fact]
	public void ToWrongScoreInfoXml_HasWrongScoreNotNull_ReturnExpected()
	{
		// Arrange
		var models = new List<WrongScoreInfoViewModel> { new WrongScoreInfoViewModel { MatchId = 1, WrongScore = "123-456" } };
		const string expected = "<root><r LiveHomeScore='123' LiveAwayScore='456' FilterFromTransTime='0001-01-01 00:00:00.000' "
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
        var models = new List<WrongScoreInfoViewModel> { new WrongScoreInfoViewModel { MatchId = 1, WrongScore = null } };
        const string expected = "<root><r LiveHomeScore='' LiveAwayScore='' FilterFromTransTime='0001-01-01 00:00:00.000' "
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
        var models = new List<WrongScoreInfoViewModel> { new WrongScoreInfoViewModel { FilterBy = 2, MatchId = 1, WrongScore = null } };
        const string expected = "<root><r LiveHomeScore='' LiveAwayScore='' FilterFromTransTime='0001-01-01 00:00:00.000' "
        + "ScoreId='0' FilterToTransTime='' SubIssueTypeId='0' MatchId='1' AATime='' PATime='' SATime='' FilterBy='2'/></root>";

        // Act
        var actual = models.ToWrongScoreInfoXml();

        // Assert
        Assert.Equal(expected, actual);
    }
}