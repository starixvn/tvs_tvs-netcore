using System;
using System.Collections.Generic;
using System.Globalization;
using NSubstitute;
using NSubstitute.Extensions;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LinkedLog;

public class LinkedLogValidationServiceTests
{
    [Theory]
    [InlineData("2024-01-01T12:00:00", "2024-01-01T00:00:00", "2024-01-02T00:00:00", true)]
    [InlineData("2024-01-01T12:00:00", "2024-01-01T12:00:00", "2024-01-01T12:00:00", true)]
    [InlineData("2023-12-31T23:59:59", "2024-01-01T00:00:00", "2024-01-02T00:00:00", false)]
    [InlineData("2024-01-02T00:00:01", "2024-01-01T00:00:00", "2024-01-02T00:00:00", false)]
    public void IsAffectedLinkTime_ReturnsExpectedResult(DateTime time, DateTime filterFrom, DateTime filterTo, bool expected)
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel
        {
            FilterFromTransTime = filterFrom,
            FilterToTransTime = filterTo
        };
        var service = new LinkedLogValidationServiceImp();

        // Act
        var result = service.IsAffectedLinkTime(time, getLinkedLogModel);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData(LinkedLogApiConstant.GroupIdAio, true)]
    [InlineData(LinkedLogApiConstant.GroupId1X2, true)]
    [InlineData(12345, false)]
    public void IsLinkGroupFullTime_ReturnsExpectedResult(int linkGroup, bool expected)
    {
        // Arrange
        var service = new LinkedLogValidationServiceImp();

        // Act
        var result = service.IsLinkGroupFullTime(linkGroup);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData(LinkedLogApiConstant.GroupIdAio, true)]
    [InlineData(LinkedLogApiConstant.GroupId1H1X2, true)]
    [InlineData(12345, false)]
    public void IsLinkGroupHalfTime_ReturnsExpectedResult(int linkGroup, bool expected)
    {
        // Arrange
        var service = new LinkedLogValidationServiceImp();

        // Act
        var result = service.IsLinkGroupHalfTime(linkGroup);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData(LinkedLogApiConstant.GroupIdAio, SubIssueTypeConstant.Handicap, true)]
    [InlineData(LinkedLogApiConstant.GroupId1X2, SubIssueTypeConstant.Handicap, true)]
    [InlineData(LinkedLogApiConstant.GroupId1H1X2, SubIssueTypeConstant.FirstHalfHandicap, true)]
    [InlineData(LinkedLogApiConstant.GroupIdAio, SubIssueTypeConstant.FirstHalfHandicap, true)]
    [InlineData(LinkedLogApiConstant.GroupId1X2, SubIssueTypeConstant.OverUnder, true)]
    [InlineData(LinkedLogApiConstant.GroupId1H1X2, SubIssueTypeConstant.OverUnder, false)]
    [InlineData(LinkedLogApiConstant.GroupId1H1X2, SubIssueTypeConstant.FirstHalfOverUnder, true)]
    [InlineData(LinkedLogApiConstant.GroupIdAio, SubIssueTypeConstant.FirstHalfOverUnder, true)]
    [InlineData(LinkedLogApiConstant.GroupId1X2, 999, false)]
    public void IsLinkGroupWrongOdds_ReturnsExpectedResult(int linkGroup, int subIssueType, bool expected)
    {
        // Arrange
        var service = new LinkedLogValidationServiceImp();

        // Act
        var result = service.IsLinkGroupWrongOdds(linkGroup, subIssueType);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("1.5", 1.5, true)]
    [InlineData("1.5", 2.0, false)]
    [InlineData("0", 0, true)]
    [InlineData("-1.5", -1.5, true)]
    public void CheckHdpWrongOddsByWrongOu_ShouldReturnExpectedResult(string wrongOU, decimal odds1a, bool expected)
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo
        {
            Odds1a = odds1a
        };

        var getLinkedLogModel = new GetLinkedLogModel
        {
            WrongOU = wrongOU
        };

        // Act
        var result = LinkedLogValidationServiceImp.CheckHdpWrongOddsByWrongOu(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void CheckHdpWrongOddsByWrongOu_WithInvalidWrongOU_ShouldThrowFormatException()
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo
        {
            Odds1a = 1.5m
        };

        var getLinkedLogModel = new GetLinkedLogModel
        {
            WrongOU = "invalid"
        };

        // Act & Assert
        Assert.Throws<FormatException>(() =>
            LinkedLogValidationServiceImp.CheckHdpWrongOddsByWrongOu(linkedOddsInfo, getLinkedLogModel));
    }

    [Theory]
    [InlineData(FilterTypeWrongOddsConstant.BetTeamHome, "1.5", 1.5, 2.0, true)]  // Home favorite matches Hdp1
    [InlineData(FilterTypeWrongOddsConstant.BetTeamHome, "1.5", 2.0, 1.5, false)] // Home favorite doesn't match Hdp1
    [InlineData(FilterTypeWrongOddsConstant.BetTeamAway, "1.5", 2.0, 1.5, true)]  // Away favorite matches Hdp2
    [InlineData(FilterTypeWrongOddsConstant.BetTeamAway, "1.5", 1.5, 2.0, false)] // Away favorite doesn't match Hdp2
    [InlineData(FilterTypeWrongOddsConstant.BetTeamHome, "0", 0, 1.0, true)]      // Zero value for home
    [InlineData(FilterTypeWrongOddsConstant.BetTeamAway, "0", 1.0, 0, true)]      // Zero value for away
    [InlineData(FilterTypeWrongOddsConstant.BetTeamHome, "-1.5", -1.5, -2.0, true)] // Negative value for home
    [InlineData(FilterTypeWrongOddsConstant.BetTeamAway, "-1.5", -2.0, -1.5, true)] // Negative value for away
    [InlineData("InvalidType", "1.5", 1.5, 1.5, false)]  // Invalid filter type
    public void CheckHdpWrongOddsByFavoriteType_ShouldReturnExpectedResult(
        string filterFavoriteType,
        string favoriteValue,
        decimal hdp1,
        decimal hdp2,
        bool expected)
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo
        {
            Hdp1 = hdp1,
            Hdp2 = hdp2
        };

        var getLinkedLogModel = new GetLinkedLogModel
        {
            FilterFavoriteType = filterFavoriteType,
            FavoriteValue = favoriteValue
        };

        // Act
        var result = LinkedLogValidationServiceImp.CheckHdpWrongOddsByFavoriteType(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void CheckHdpWrongOddsByFavoriteType_WithInvalidFavoriteValue_ShouldThrowFormatException()
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo
        {
            Hdp1 = 1.5m,
            Hdp2 = 2.0m
        };

        var getLinkedLogModel = new GetLinkedLogModel
        {
            FilterFavoriteType = FilterTypeWrongOddsConstant.BetTeamHome,
            FavoriteValue = "invalid"
        };

        // Act & Assert
        Assert.Throws<FormatException>(() =>
            LinkedLogValidationServiceImp.CheckHdpWrongOddsByFavoriteType(linkedOddsInfo, getLinkedLogModel));
    }

    [Fact]
    public void IsAffectedLinkedOddsForWrong1stHdp_ShouldReturnFalse_WhenDictionaryEmpty()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>();
        var getLinkedLogModel = new GetLinkedLogModel();
        var service = new LinkedLogValidationServiceImp();

        // Act
        var result = service.IsAffectedLinkedOddsForWrong1stHdp(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void IsAffectedLinkedOddsForWrong1stHdp_ShouldReturnTrue_WhenConditionMet()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = BetTypeConstant.FirstHalfHandicap } }
        };
        var getLinkedLogModel = new GetLinkedLogModel();
        var service = Substitute.ForPartsOf<LinkedLogValidationServiceImp>();
        service.Configure().CheckLinkedOddsForWrongHdp1stHdpBySubIssueType(Arg.Any<LinkedOddsInfo>(), Arg.Any<GetLinkedLogModel>()).Returns(true);

        // Act
        var result = service.IsAffectedLinkedOddsForWrong1stHdp(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsAffectedLinkedOddsForWrong1stHdp_ShouldReturnFalse_WhenConditionNotMet()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = BetTypeConstant.FirstHalfHandicap } }
        };
        var getLinkedLogModel = new GetLinkedLogModel();
        var service = Substitute.ForPartsOf<LinkedLogValidationServiceImp>();
        service.Configure().CheckLinkedOddsForWrongHdp1stHdpBySubIssueType(Arg.Any<LinkedOddsInfo>(), Arg.Any<GetLinkedLogModel>()).Returns(false);

        // Act
        var result = service.IsAffectedLinkedOddsForWrong1stHdp(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData(SubIssueTypeConstant.WrongHDP, "", "10", 10, true)]
    [InlineData(SubIssueTypeConstant.WrongHDP, "10&20", "", 20, true)]
    [InlineData(SubIssueTypeConstant.Wrong1stHDP, "30&40", "", 40, true)]
    [InlineData(SubIssueTypeConstant.Wrong1stHDP, "", "50&60", 60, true)]
    [InlineData(SubIssueTypeConstant.WrongHDPHomeVirtualHeadReversed, "", "", 10, true)]
    [InlineData(SubIssueTypeConstant.WrongHDPAwayVirtualHeadReversed, "", "20", 20, true)]
    public void CheckLinkedOddsForWrongHdp1stHdpBySubIssueType_ShouldReturnExpectedResult(int subIssueTypeId, string homeFavorite, string awayFavorite, int hdpValue, bool expectedResult)
    {
        // Arrange
        var hdpValueDecimal = (decimal)hdpValue;
        var linkedOddsInfo = new LinkedOddsInfo { Hdp1 = hdpValueDecimal, Hdp2 = hdpValueDecimal };
        var getLinkedLogModel = new GetLinkedLogModel
        {
            SubIssueTypeId = subIssueTypeId,
            HomeFavorite = homeFavorite,
            AwayFavorite = awayFavorite,
            HdpValue = hdpValueDecimal.ToString(CultureInfo.InvariantCulture)
        };
        var service = new LinkedLogValidationServiceImp();

        // Act
        var result = service.CheckLinkedOddsForWrongHdp1stHdpBySubIssueType(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.Equal(expectedResult, result);
    }

    [Fact]
    public void CheckLinkedOddsForWrongHdp1stHdpBySubIssueType_ShouldReturnFalse_WhenDefaultCase()
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { Hdp1 = 99, Hdp2 = 88 };
        var getLinkedLogModel = new GetLinkedLogModel { SubIssueTypeId = 999 };
        var service = new LinkedLogValidationServiceImp();

        // Act
        var result = service.CheckLinkedOddsForWrongHdp1stHdpBySubIssueType(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData("1.5", BetTypeConstant.OverUnder, 1.5, true)]
    [InlineData("1.5", BetTypeConstant.OverUnder, 2.0, false)]
    [InlineData("1.5&2.0", BetTypeConstant.OverUnder, 1.5, true)]
    [InlineData("1.5&2.0", BetTypeConstant.OverUnder, 2.0, true)]
    public void IsAffectedLinkedOddsForWrongOU_ShouldReturnExpectedResult(string wrongMarket, int betType, decimal hdp1, bool expected)
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = betType, Hdp1 = hdp1 } }
        };

        var getLinkedLogModel = new GetLinkedLogModel { WrongMarket = wrongMarket };

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsAffectedLinkedOddsForWrongOU(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("1.5", BetTypeConstant.FirstHalfOverUnder, 1.5, true)]
    [InlineData("1.5", BetTypeConstant.FirstHalfOverUnder, 2.0, false)]
    [InlineData("1.5&2.0", BetTypeConstant.FirstHalfOverUnder, 1.5, true)]
    [InlineData("1.5&2.0", BetTypeConstant.FirstHalfOverUnder, 2.0, true)]
    public void IsAffectedLinkedOddsForWrong1stOU_ShouldReturnExpectedResult(string wrongMarket, int betType, decimal hdp1, bool expected)
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = betType, Hdp1 = hdp1 } }
        };

        var getLinkedLogModel = new GetLinkedLogModel { WrongMarket = wrongMarket };

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsAffectedLinkedOddsForWrong1stOU(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void IsAffectedLinkedOddsForWrongOdds_ShouldReturnTrue()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = 1, Hdp1 = 1.5m, Odds1a = 0.5m, Odds2a = 2.5m } }
        };

        var getLinkedLogModel = new GetLinkedLogModel
        {
            SubIssueTypeId = 6,
            FilterFavoriteType = "h",
            FavoriteValue = "1.5",
            FromOddsNotVoidHomeOver = "1.5"
        };

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsAffectedLinkedOddsForWrongOdds(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsAffectedLinkedOddsForWrongOdds_ShouldReturnFalse()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = 1, Hdp1 = 1.5m, Odds1a = 0.5m, Odds2a = 2.5m } }
        };

        var getLinkedLogModel = new GetLinkedLogModel
        {
            SubIssueTypeId = 111,
            FilterFavoriteType = "h",
            FavoriteValue = "1.5",
            FromOddsNotVoidHomeOver = "0.2"
        };

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsAffectedLinkedOddsForWrongOdds(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData(BetTypeConstant.Handicap, BetTypeConstant.Handicap, true)]
    [InlineData(BetTypeConstant.Handicap, BetTypeConstant.OverUnder, false)]
    public void IsAnyLinkedOddsByBetType_ShouldReturnExpectedResult(int betTypeToCheck, int betTypeInDic, bool expected)
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = betTypeInDic } }
        };

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsAnyLinkedOddsByBetType(linkedOddsInfoDic, betTypeToCheck);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData(SubIssueTypeConstant.Handicap, BetTypeConstant.Handicap, true)]
    [InlineData(SubIssueTypeConstant.FirstHalfHandicap, BetTypeConstant.FirstHalfHandicap, true)]
    [InlineData(SubIssueTypeConstant.OverUnder, BetTypeConstant.OverUnder, true)]
    [InlineData(SubIssueTypeConstant.FirstHalfOverUnder, BetTypeConstant.FirstHalfOverUnder, true)]
    [InlineData(SubIssueTypeConstant.FixGame, BetTypeConstant.OverUnder, false)]
    public void IsValidBetTypeWrongOdds_ShouldReturnExpectedResult(int subIssueTypeId, int betType, bool expected)
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { SubIssueTypeId = subIssueTypeId };

        // Act
        var result = LinkedLogValidationServiceImp.IsValidBetTypeWrongOdds(betType, getLinkedLogModel);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData(SubIssueTypeConstant.Handicap, FilterTypeWrongOddsConstant.BetTeamHome, "1.5", 1.5, true)]
    [InlineData(SubIssueTypeConstant.FirstHalfHandicap, FilterTypeWrongOddsConstant.BetTeamHome, "1.5", 1.5, true)]
    [InlineData(SubIssueTypeConstant.OverUnder, FilterTypeWrongOddsConstant.BetTeamHome, "1.5", 1.5, true)]
    [InlineData(SubIssueTypeConstant.FirstHalfOverUnder, FilterTypeWrongOddsConstant.BetTeamHome, "1.5", 1.5, true)]
    [InlineData(SubIssueTypeConstant.FixGame, FilterTypeWrongOddsConstant.BetTeamHome, "1.5", 1.5, false)]
    public void IsValidHdpWrongOdds_ShouldReturnExpectedResult(int subIssueTypeId, string filterFavoriteType, string favoriteValue, decimal hdp1, bool expected)
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { Hdp1 = hdp1, Odds1a = 1.5m };
        var getLinkedLogModel = new GetLinkedLogModel
        {
            SubIssueTypeId = subIssueTypeId,
            FilterFavoriteType = filterFavoriteType,
            FavoriteValue = favoriteValue,
            WrongOU = "1.5"
        };

        // Act
        var result = LinkedLogValidationServiceImp.IsValidHdpWrongOdds(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("1.0", "2.0", "1.0", "2.0", 0.5, 2.5, true)]
    [InlineData("1.0", "2.0", "1.0", "2.0", 1.5, 1.5, false)]
    public void IsValidOddsWrongOdds_ShouldReturnExpectedResult(
        string fromOddsNotVoidHomeOver,
        string toOddsNotVoidHomeOver,
        string fromOddsNotVoidAwayUnder,
        string toOddsNotVoidAwayUnder,
        decimal odds1a,
        decimal odds2a,
        bool expected)
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { Odds1a = odds1a, Odds2a = odds2a };
        var getLinkedLogModel = new GetLinkedLogModel
        {
            FromOddsNotVoidHomeOver = fromOddsNotVoidHomeOver,
            ToOddsNotVoidHomeOver = toOddsNotVoidHomeOver,
            FromOddsNotVoidAwayUnder = fromOddsNotVoidAwayUnder,
            ToOddsNotVoidAwayUnder = toOddsNotVoidAwayUnder
        };

        // Act
        var result = LinkedLogValidationServiceImp.IsValidOddsWrongOdds(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void IsAnyLinkedOddsByBetTypeForWrongOdds_WithEmptyDictionary_ShouldReturnFalse()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>();
        var getLinkedLogModel = new GetLinkedLogModel
        {
            SubIssueTypeId = SubIssueTypeConstant.Handicap
        };

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsAnyLinkedOddsByBetTypeForWrongOdds(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void IsAnyLinkedOddsByBetTypeForWrongOdds_WithMultipleEntries_ShouldReturnTrue()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = BetTypeConstant.OverUnder } },
            { 2, new LinkedOddsInfo { BetType = BetTypeConstant.Handicap } }
        };

        var getLinkedLogModel = new GetLinkedLogModel
        {
            SubIssueTypeId = SubIssueTypeConstant.Handicap
        };

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsAnyLinkedOddsByBetTypeForWrongOdds(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.True(result);
    }

    [Theory]
    [InlineData("2023-01-01 10:00:00", "2023-01-01 09:00:00", false)]
    [InlineData("2023-01-01 10:00:00", "2023-01-02 11:00:00", true)]
    public void IsNotAffectedLinkTime_ShouldReturnExpected(string time, string filterFromTransTime, bool expected)
    {
        // Arrange
        var timeDate = DateTime.Parse(time);
        var filterFromDate = DateTime.Parse(filterFromTransTime);

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsNotAffectedLinkTime(timeDate, filterFromDate);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void IsAffectedLinkedOddsForWrongHdp_WithEmptyDictionary_ShouldReturnFalse()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>();
        var getLinkedLogModel = new GetLinkedLogModel
        {
            SubIssueTypeId = SubIssueTypeConstant.WrongHDP,
            HomeFavorite = "1.5"
        };

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsAffectedLinkedOddsForWrongHdp(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void IsAffectedLinkedOddsForWrongHdp_WithMultipleEntries_ShouldReturnTrue()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = BetTypeConstant.OverUnder, Hdp1 = 1.5m } },
            { 2, new LinkedOddsInfo { BetType = BetTypeConstant.Handicap, Hdp1 = 1.5m } }
        };

        var getLinkedLogModel = new GetLinkedLogModel
        {
            SubIssueTypeId = SubIssueTypeConstant.WrongHDP,
            HomeFavorite = "1.5"
        };

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsAffectedLinkedOddsForWrongHdp(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.True(result);
    }
}