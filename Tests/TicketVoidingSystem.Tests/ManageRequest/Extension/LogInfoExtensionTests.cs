using System;
using System.Collections.Generic;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Extension;

public class LogInfoExtensionTests
{
    [Fact]
    public void GetKickOffInfoXml_NoHasKickOffTime_ReturnExpected()
    {
        // Arrange
        var models = new List<EarlyKickOffViewModel>();

        // Act
        var result = models.ToKickOffInfoXml();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void GetKickOffInfoXml_HasDataViewModel_ReturnExpected()
    {
        // Arrange
        var models = new List<EarlyKickOffViewModel> { new() { MatchId = 1 } };

        // Act
        var result = models.ToKickOffInfoXml();

        // Assert
        Assert.Equal("<root><r MatchId='1' KickOffTime=''/></root>", result);
    }

    [Fact]
    public void GetKickOffInfoXml_NoHasKickOffTimeInDataViewModel_ReturnExpected()
    {
        // Arrange
        var models = new List<EarlyKickOffViewModel> { new() { MatchId = 1, KickOffTime = new DateTime(2023, 2, 2) } };

        // Act
        var result = models.ToKickOffInfoXml();

        // Assert
        Assert.Equal("<root><r MatchId='1' KickOffTime='02/01/2023 12:00:00'/></root>", result);
    }

    [Fact]
    public void ToTechnicalErrorInfoXml_HasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new TechnicalErrorViewModel
        {
            MatchId = 745632,
            FilterFromTransTime = new DateTime(2025, 2, 2),
            FilterToTransTime = new DateTime(2025, 2, 2),
            SubIssueTypeId = 3
        };
        const string expected = "<root><r MatchId = '745632' FilterFromTransTime='2025-02-02 00:00:00.000' FilterToTransTime='2025-02-02 00:00:00.000' " +
                                "SubIssueTypeId='3' AdvancedExtraInfo='null'/></root>";

        // Act
        var result = model.ToTechnicalErrorInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToTechnicalErrorInfoXml_NoHasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new TechnicalErrorViewModel
        {
            MatchId = 745632,
            SubIssueTypeId = 3
        };
        const string expected = "<root><r MatchId = '745632' FilterFromTransTime='' FilterToTransTime='' " +
                                "SubIssueTypeId='3' AdvancedExtraInfo='null'/></root>";

        // Act
        var result = model.ToTechnicalErrorInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToOtherIssuesInfoXml_HasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new OtherIssuesViewModel
        {
            MatchId = 745632,
            FilterFromTransTime = new DateTime(2025, 2, 2),
            FilterToTransTime = new DateTime(2025, 2, 2),
            SubIssueTypeId = 3
        };
        const string expected = "<root><r MatchId = '745632' SubIssueTypeId='3' FilterFromTransTime='2025-02-02 00:00:00.000' FilterToTransTime='2025-02-02 00:00:00.000' " +
                                "AdvancedExtraInfo='null'/></root>";

        // Act
        var result = model.ToOtherIssuesInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToOtherIssuesInfoXml_NoHasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new OtherIssuesViewModel
        {
            MatchId = 745632,
            SubIssueTypeId = 3
        };
        const string expected = "<root><r MatchId = '745632' SubIssueTypeId='3' FilterFromTransTime='' FilterToTransTime='' " +
                                "AdvancedExtraInfo='null'/></root>";

        // Act
        var result = model.ToOtherIssuesInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToWrongOfferedNameInfoXml_ReturnExpected()
    {
        // Arrange
        var model = new WrongOfferedNameViewModel
        {
            MatchId = 745632,
            SubIssueTypeId = 3,
            CurrencyIds = "1",
            LicenseeNames = "LicenseeNames"
        };
        const string expected = "<root><r MatchId = '745632' CurrencyIds='1' LicenseeNames='LicenseeNames' SubIssueTypeId='3'/></root>";

        // Act
        var result = model.ToWrongOfferedNameInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToWrongOddsSportsBookInfoXml_HasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new WrongOddsSportsBookViewModel
        {
            MatchId = 745632,
            FilterFromTransTime = new DateTime(2025, 2, 2),
            FilterToTransTime = new DateTime(2025, 2, 2),
            SubIssueTypeId = 3,
            LiveIndicator = 1,
            FilterOddsType = "1",
            OddsValue = "0.89",
            FromOdds = "0.6",
            ToOdds = "0.89",
            CorrectOdds = "0.9"
        };
        const string expected = "<root><r MatchId = '745632' FilterFromTransTime='2025-02-02 00:00:00.000' FilterToTransTime='2025-02-02 00:00:00.000' " +
                                "SubIssueTypeId='3' LiveIndicator='1' FilterOddsType='1' OddsValue='0.89' FromOdds='0.6' " +
                                "ToOdds='0.89' CorrectOdds='0.9' AdvancedExtraInfo='null'/></root>";

        // Act
        var result = model.ToWrongOddsSportsBookInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToWrongOddsSportsBookInfoXml_NoHasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new WrongOddsSportsBookViewModel
        {
            MatchId = 745632,
            SubIssueTypeId = 3,
            LiveIndicator = 1,
            FilterOddsType = "1",
            OddsValue = "0.89",
            FromOdds = "0.6",
            ToOdds = "0.89",
            CorrectOdds = "0.9"
        };
        const string expected = "<root><r MatchId = '745632' FilterFromTransTime='' FilterToTransTime='' SubIssueTypeId='3' LiveIndicator='1' " +
                                "FilterOddsType='1' OddsValue='0.89' FromOdds='0.6' ToOdds='0.89' CorrectOdds='0.9' " +
                                "AdvancedExtraInfo='null'/></root>";

        // Act
        var result = model.ToWrongOddsSportsBookInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToWrongMarketOfferedInfoXml_HasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new WrongMarketOfferedViewModel
        {
            MatchId = 745632,
            FilterFromTransTime = new DateTime(2025, 2, 2),
            FilterToTransTime = new DateTime(2025, 2, 2),
            SubIssueTypeId = 3
        };
        const string expected = "<root><r MatchId='745632' Id='0' FilterFromTransTime='2025-02-02 00:00:00.000' FilterToTransTime='2025-02-02 00:00:00.000' " +
                                "SubIssueTypeId='3' AdvancedExtraInfo='null' /></root>";
        List<WrongMarketOfferedViewModel> models = [model];

        // Act
        var result = models.ToWrongMarketOfferedInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToWrongMarketOfferedInfoXml_NoHasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new WrongMarketOfferedViewModel
        {
            MatchId = 745632,
            SubIssueTypeId = 3
        };
        const string expected = "<root><r MatchId='745632' Id='0' FilterFromTransTime='' FilterToTransTime='' " +
                                "SubIssueTypeId='3' AdvancedExtraInfo='null' /></root>";
        List<WrongMarketOfferedViewModel> models = [model];

        // Act
        var result = models.ToWrongMarketOfferedInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToWrongMarketOfferedInfoXml_NoHasModel_ReturnEmpty()
    {
        // Arrange
        List<WrongMarketOfferedViewModel> models = [];

        // Act
        var result = models.ToWrongMarketOfferedInfoXml();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void ToMatchEarlyCompletedInfoXml_WithValidData_ReturnExpected()
    {
        // Arrange
        var model = new OtherIssuesViewModel
        {
            MatchId = 123,
            SubIssueTypeId = 456
        };

        // Act
        var actual = model.ToMatchEarlyCompletedInfoXml();

        // Assert
        var expected = $"<root><r MatchId = '{model.MatchId}' "
            + $"SubIssueTypeId='{model.SubIssueTypeId}' "
            + $"AdvancedExtraInfo='null'/></root>";
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToMatchEarlyCompletedInfoXml_WithNullBetTeamsResult_ReturnExpected()
    {
        // Arrange
        var model = new OtherIssuesViewModel
        {
            MatchId = 123,
            SubIssueTypeId = 456
        };

        // Act
        var actual = model.ToMatchEarlyCompletedInfoXml();

        // Assert
        var expected = $"<root><r MatchId = '{model.MatchId}' "
            + $"SubIssueTypeId='{model.SubIssueTypeId}' "
            + $"AdvancedExtraInfo='null'/></root>";
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToMatchEarlyCompletedInfoXml_WithEmptyBetTeamsResult_ReturnExpected()
    {
        // Arrange
        var model = new OtherIssuesViewModel
        {
            MatchId = 123,
            SubIssueTypeId = 456
        };

        // Act
        var actual = model.ToMatchEarlyCompletedInfoXml();

        // Assert
        var expected = $"<root><r MatchId = '{model.MatchId}' "
            + $"SubIssueTypeId='{model.SubIssueTypeId}' "
            + $"AdvancedExtraInfo='null'/></root>";
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToWrongScoreInfoXml_WithValidData_ReturnExpected()
    {
        // Arrange
        var models = new List<WrongScoreInfoViewModel>
        {
            new()
            {
                MatchId = 123,
                ScoreId = 456,
                SubIssueTypeId = 789,
                WrongScore = "1-0",
                ActualScore = "2-0",
                EventDate = new DateTime(2024, 1, 1),
                FilterFromTransTime = new DateTime(2024, 1, 1),
                FilterToTransTime = new DateTime(2024, 1, 1)
            }
        };

        // Act
        var actual = models.ToWrongScoreInfoXml();

        // Assert
        const string expected = "<root><r LiveHomeScore='1' LiveAwayScore='0' FilterFromTransTime='2024-01-01 00:00:00.000' FilterToTransTime='2024-01-01 00:00:00.000' " +
                                "VoidFromTime='' VoidToTime='' ScoreId='456' SubIssueTypeId='789' MatchId='123' AATime='' PATime='' SATime='' FilterBy=''/></root>";
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToWrongScoreInfoXml_WithEmptyList_ReturnEmpty()
    {
        // Arrange
        var models = new List<WrongScoreInfoViewModel>();

        // Act
        var actual = models.ToWrongScoreInfoXml();

        // Assert
        Assert.Equal(string.Empty, actual);
    }

    [Fact]
    public void ToDangerAcceptedInfoXml_WithValidData_ReturnExpected()
    {
        // Arrange
        var models = new List<DangerAcceptedViewModel>
        {
            new()
            {
                MatchId = 123,
                SubIssueTypeId = 456,
                FilterFromTransTime = new DateTime(2024, 1, 1),
                FilterToTransTime = new DateTime(2024, 1, 1)
            }
        };

        // Act
        var actual = models.ToDangerAcceptedInfoXml();

        // Assert
        const string expected = "<root><r MatchId='123' FilterFromTransTime='2024-01-01 00:00:00.000' FilterToTransTime='2024-01-01 00:00:00.000' " +
                                "VoidFromTime='' VoidToTime='' SubIssueTypeId='456' AATime='' PATime='' SATime='' FilterBy=''/></root>";
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToDangerAcceptedInfoXml_WithEmptyList_ReturnEmpty()
    {
        // Arrange
        var models = new List<DangerAcceptedViewModel>();

        // Act
        var actual = models.ToDangerAcceptedInfoXml();

        // Assert
        Assert.Equal(string.Empty, actual);
    }

    [Fact]
    public void ToWrongHdpInfoXml_WithValidData_ReturnsCorrectXml()
    {
        // Arrange
        var wrongHdps = new List<WrongHdpViewModel>
        {
            new()
            {
                MatchId = 123,
                MatchCode = "TEST123",
                Name = "Test Match",
                LeagueName = "Test League",
                IsMainMatch = true,
                IssueTypeId = 1,
                SubIssueTypeId = 2,
                EventDate = new DateTime(2025, 5, 22, 14, 56, 19),
                FilterFromTransTime = new DateTime(2025, 5, 22, 14, 56, 19),
                FilterToTransTime = new DateTime(2025, 5, 22, 14, 56, 19),
                VoidFromTime = new DateTime(2025, 5, 22, 14, 56, 19),
                VoidToTime = new DateTime(2025, 5, 22, 14, 56, 19),
                HomeFavorite = "Home",
                AwayFavorite = "Away",
                ActualMarket = "Market",
                HdpValue = "0.75",
                PoolHouseCheckedBetTypes = "All",
                IsLinkGroup1X2 = true,
                IsLinkGroupAIO = false,
                LiveIndicator = 1,
                SportType = 1,
                FilterBetIdX = "X",
                FilterBetIdY = "Y",
                FilterBetTypeId = "1"
            }
        };

        // Act
        var result = wrongHdps.ToWrongHdpInfoXml();

        // Assert
        const string expected = "<root><r MatchId='123' FilterFromTransTime='2025-05-22 14:56:19.000' FilterToTransTime='2025-05-22 14:56:19.000' " +
                                "IsMainMatch='True' PoolHouseCheckedBetTypes='All' SubIssueTypeId='2' IsLinkGroup1X2='True' IsLinkGroupAIO ='False' " +
                                "LiveIndicator='1' HomeFavorite='Home' AwayFavorite='Away' HdpValue='0.75' FilterBetIdX='X' FilterBetIdY='Y' FilterBetTypeId='1' /></root>";
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToWrongHdpInfoXml_WithEmptyList_ReturnsEmptyString()
    {
        // Arrange
        var wrongHdps = new List<WrongHdpViewModel>();

        // Act
        var result = wrongHdps.ToWrongHdpInfoXml();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void ToWrongOuInfoXml_WithValidData_ReturnsCorrectXml()
    {
        // Arrange
        var wrongOus = new List<WrongOuViewModel>
        {
            new()
            {
                MatchId = 123,
                MatchCode = "TEST123",
                Name = "Test Match",
                LeagueName = "Test League",
                IsMainMatch = true,
                IssueTypeId = 1,
                SubIssueTypeId = 2,
                EventDate = new DateTime(2025, 5, 22, 14, 56, 19),
                FilterFromTransTime = new DateTime(2025, 5, 22, 14, 56, 19),
                FilterToTransTime = new DateTime(2025, 5, 22, 14, 56, 19),
                VoidFromTime = new DateTime(2025, 5, 22, 14, 56, 19),
                VoidToTime = new DateTime(2025, 5, 22, 14, 56, 19),
                ActualMarket = "Market",
                WrongMarket = "Wrong Market",
                PoolHouseCheckedBetTypes = "All",
                IsLinkGroup1X2 = true,
                IsLinkGroupAIO = false,
                LiveIndicator = 1,
                SportType = 1,
                FilterBetIdX = "X",
                FilterBetIdY = "Y",
                FilterBetTypeId = "1"
            }
        };

        // Act
        var result = wrongOus.ToWrongOuInfoXml();

        // Assert
        const string expected = "<root><r MatchId='123' FilterFromTransTime='2025-05-22 14:56:19.000' FilterToTransTime='2025-05-22 14:56:19.000' " +
                                "SubIssueTypeId='2' IsMainMatch='True' LiveIndicator='1' PoolHouseCheckedBetTypes='All' IsLinkGroup1X2='True' " +
                                "IsLinkGroupAIO ='False' WrongMarket='Wrong Market' FilterBetIdX='X' FilterBetIdY='Y' FilterBetTypeId='1' /></root>";
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToWrongOuInfoXml_WithEmptyList_ReturnsEmptyString()
    {
        // Arrange
        var wrongOus = new List<WrongOuViewModel>();

        // Act
        var result = wrongOus.ToWrongOuInfoXml();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void ToWrong1stHdpInfoXml_WithValidData_ReturnExpected()
    {
        // Arrange
        var models = new List<WrongHdpViewModel>
        {
            new()
            {
                MatchId = 123,
                SubIssueTypeId = 456,
                FilterFromTransTime = new DateTime(2024, 1, 1),
                FilterToTransTime = new DateTime(2024, 1, 1)
            }
        };

        // Act
        var actual = models.ToWrongHdpInfoXml();

        // Assert
        const string expected = "<root><r MatchId='123' FilterFromTransTime='2024-01-01 00:00:00.000' FilterToTransTime='2024-01-01 00:00:00.000' " +
                                "IsMainMatch='False' PoolHouseCheckedBetTypes='' SubIssueTypeId='456' IsLinkGroup1X2='False' IsLinkGroupAIO ='False' " +
                                "LiveIndicator='0' HomeFavorite='' AwayFavorite='' HdpValue='' FilterBetIdX='' FilterBetIdY='' FilterBetTypeId='' /></root>";
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToWrong1stHdpInfoXml_WithEmptyList_ReturnEmpty()
    {
        // Arrange
        var models = new List<WrongHdpViewModel>();

        // Act
        var actual = models.ToWrongHdpInfoXml();

        // Assert
        Assert.Equal(string.Empty, actual);
    }

    [Fact]
    public void ToWrong1stOuInfoXml_WithValidData_ReturnExpected()
    {
        // Arrange
        var models = new List<WrongOuViewModel>
        {
            new()
            {
                MatchId = 123,
                SubIssueTypeId = 456,
                FilterFromTransTime = new DateTime(2024, 1, 1),
                FilterToTransTime = new DateTime(2024, 1, 1)
            }
        };

        // Act
        var actual = models.ToWrongOuInfoXml();

        // Assert
        const string expected = "<root><r MatchId='123' FilterFromTransTime='2024-01-01 00:00:00.000' FilterToTransTime='2024-01-01 00:00:00.000' " +
                                "SubIssueTypeId='456' IsMainMatch='False' LiveIndicator='0' PoolHouseCheckedBetTypes='' IsLinkGroup1X2='False' " +
                                "IsLinkGroupAIO ='False' WrongMarket='' FilterBetIdX='' FilterBetIdY='' FilterBetTypeId='' /></root>";
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToWrong1stOuInfoXml_WithEmptyList_ReturnEmpty()
    {
        // Arrange
        var models = new List<WrongOuViewModel>();

        // Act
        var actual = models.ToWrongOuInfoXml();

        // Assert
        Assert.Equal(string.Empty, actual);
    }

    [Fact]
    public void ToWrongOddsInfoXml_WithValidData_ReturnExpected()
    {
        // Arrange
        var models = new List<WrongOddsViewModel>
        {
            new()
            {
                MatchId = 123,
                SubIssueTypeId = 456,
                FilterFromTransTime = new DateTime(2024, 1, 1),
                FilterToTransTime = new DateTime(2024, 1, 1)
            }
        };

        // Act
        var actual = models.ToWrongOddsInfoXml();

        // Assert
        const string expected = "<root><r MatchId='123' FilterFromTransTime='2024-01-01 00:00:00.000' FilterToTransTime='2024-01-01 00:00:00.000' " +
                                "SubIssueTypeId='456' LiveIndicator='0' FilterFavoriteType='' FavoriteValue='' PoolHouseCheckedBetTypes='' " +
                                "IsLinkGroup1X2='False' IsLinkGroupAIO ='False' WrongOU='' Spread='' AllowanceRate='' CorrectOddsHomeOver='' " +
                                "CorrectOddsAwayUnder='' FromOddsNotVoidHomeOver='' ToOddsNotVoidHomeOver='' FromOddsNotVoidAwayUnder='' " +
                                "ToOddsNotVoidAwayUnder='' /></root>";
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToWrongOddsInfoXml_WithEmptyList_ReturnEmpty()
    {
        // Arrange
        var models = new List<WrongOddsViewModel>();

        // Act
        var actual = models.ToWrongOddsInfoXml();

        // Assert
        Assert.Equal(string.Empty, actual);
    }

    [Fact]
    public void ToReducedOverInfoXml_WithValidData_ReturnExpected()
    {
        // Arrange
        var models = new List<ReducedOverViewModel>
        {
            new()
            {
                MatchId = 123,
                SubIssueTypeId = 456
            }
        };

        // Act
        var actual = models.ToReducedOverInfoXml();

        // Assert
        const string expected = "<root><r MatchId='123' SubIssueTypeId='456' BetTypeIds='' WicketOver='' FilterWicketOver='' PlayerIds='' " +
                                "Runs='' NonLive='False' Live='False' /></root>";
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToReducedOverInfoXml_WithEmptyList_ReturnEmpty()
    {
        // Arrange
        var models = new List<ReducedOverViewModel>();

        // Act
        var actual = models.ToReducedOverInfoXml();

        // Assert
        Assert.Equal(string.Empty, actual);
    }

    [Fact]
    public void ToNotParticipateInfoXml_WithValidData_ReturnExpected()
    {
        // Arrange
        var models = new List<NotParticipateViewModel>
        {
            new()
            {
                MatchId = 123,
                SubIssueTypeId = 456
            }
        };

        // Act
        var actual = models.ToNotParticipateInfoXml();

        // Assert
        const string expected = "<root><r MatchId='123' SubIssueTypeId='456' PlayerId='0' BetTypeIds='' /></root>";
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToNotParticipateInfoXml_WithEmptyList_ReturnEmpty()
    {
        // Arrange
        var models = new List<NotParticipateViewModel>();

        // Act
        var actual = models.ToNotParticipateInfoXml();

        // Assert
        Assert.Equal(string.Empty, actual);
    }
}