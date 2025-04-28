using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using Xunit;

namespace TicketVoidingSystem.ManageRequest.Tests.Services.AddRequest.LinkedLog;

public class LinkedLogValidationServiceTests
{
    [Theory]
    [InlineData("1.5", 1.5, true)]  // Trường hợp khớp giá trị
    [InlineData("1.5", 2.0, false)] // Trường hợp không khớp giá trị
    [InlineData("0", 0, true)]      // Trường hợp giá trị 0
    [InlineData("-1.5", -1.5, true)] // Trường hợp giá trị âm
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
    public void CheckHdpWrongOddsByWrongOu_WithNullWrongOU_ShouldThrowFormatException()
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo
        {
            Odds1a = 1.5m
        };
        
        var getLinkedLogModel = new GetLinkedLogModel
        {
            WrongOU = null
        };

        // Act & Assert
        Assert.Throws<FormatException>(() => 
            LinkedLogValidationServiceImp.CheckHdpWrongOddsByWrongOu(linkedOddsInfo, getLinkedLogModel));
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
    public void CheckHdpWrongOddsByFavoriteType_WithNullFavoriteValue_ShouldThrowFormatException()
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
            FavoriteValue = null
        };

        // Act & Assert
        Assert.Throws<FormatException>(() => 
            LinkedLogValidationServiceImp.CheckHdpWrongOddsByFavoriteType(linkedOddsInfo, getLinkedLogModel));
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

    [Theory]
    [InlineData(SubIssueTypeConstant.Handicap, BetTypeConstant.Handicap, "1.5", 1.5, "1.0", "2.0", "1.0", "2.0", true)]
    [InlineData(SubIssueTypeConstant.FirstHalfHandicap, BetTypeConstant.FirstHalfHandicap, "1.5", 1.5, "1.0", "2.0", "1.0", "2.0", true)]
    [InlineData(SubIssueTypeConstant.OverUnder, BetTypeConstant.OverUnder, "1.5", 1.5, "1.0", "2.0", "1.0", "2.0", true)]
    [InlineData(SubIssueTypeConstant.FirstHalfOverUnder, BetTypeConstant.FirstHalfOverUnder, "1.5", 1.5, "1.0", "2.0", "1.0", "2.0", true)]
    public void IsAffectedLinkedOddsForWrongOdds_ShouldReturnExpectedResult(
        int subIssueTypeId,
        int betType,
        string favoriteValue,
        decimal hdp1,
        string fromOddsNotVoidHomeOver,
        string toOddsNotVoidHomeOver,
        string fromOddsNotVoidAwayUnder,
        string toOddsNotVoidAwayUnder,
        bool expected)
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = betType, Hdp1 = hdp1, Odds1a = 0.5m, Odds2a = 2.5m } }
        };
        
        var getLinkedLogModel = new GetLinkedLogModel 
        { 
            SubIssueTypeId = subIssueTypeId,
            FavoriteValue = favoriteValue,
            FromOddsNotVoidHomeOver = fromOddsNotVoidHomeOver,
            ToOddsNotVoidHomeOver = toOddsNotVoidHomeOver,
            FromOddsNotVoidAwayUnder = fromOddsNotVoidAwayUnder,
            ToOddsNotVoidAwayUnder = toOddsNotVoidAwayUnder
        };

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsAffectedLinkedOddsForWrongOdds(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("2023-01-01 10:00:00", "2023-01-01 09:00:00", true)]
    [InlineData("2023-01-01 10:00:00", "2023-01-01 10:00:00", false)]
    [InlineData("2023-01-01 10:00:00", "2023-01-01 11:00:00", false)]
    public void IsNotAffectedLinkTime_ShouldReturnExpectedResult(string time, string filterFromTime, bool expected)
    {
        // Arrange
        var timeDate = DateTime.Parse(time);
        var filterFromDate = DateTime.Parse(filterFromTime);

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsNotAffectedLinkTime(timeDate, filterFromDate);

        // Assert
        Assert.Equal(expected, result);
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
    [InlineData(SubIssueTypeConstant.Handicap, BetTypeConstant.OverUnder, false)]
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
    [InlineData(SubIssueTypeConstant.OverUnder, "1.5", 1.5, true)]
    [InlineData(SubIssueTypeConstant.FirstHalfOverUnder, "1.5", 1.5, true)]
    public void IsValidHdpWrongOdds_ShouldReturnExpectedResult(
        int subIssueTypeId,
        string filterFavoriteType = null,
        string favoriteValue = null,
        decimal hdp1 = 0,
        bool expected = false)
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { Hdp1 = hdp1 };
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

    [Theory]
    [InlineData(SubIssueTypeConstant.Handicap, BetTypeConstant.Handicap, true)]  // Handicap matches
    [InlineData(SubIssueTypeConstant.FirstHalfHandicap, BetTypeConstant.FirstHalfHandicap, true)]  // First Half Handicap matches
    [InlineData(SubIssueTypeConstant.OverUnder, BetTypeConstant.OverUnder, true)]  // Over Under matches
    [InlineData(SubIssueTypeConstant.FirstHalfOverUnder, BetTypeConstant.FirstHalfOverUnder, true)]  // First Half Over Under matches
    [InlineData(SubIssueTypeConstant.Handicap, BetTypeConstant.OverUnder, false)]  // Handicap doesn't match Over Under
    [InlineData(SubIssueTypeConstant.FirstHalfHandicap, BetTypeConstant.Handicap, false)]  // First Half Handicap doesn't match Handicap
    [InlineData(SubIssueTypeConstant.OverUnder, BetTypeConstant.FirstHalfOverUnder, false)]  // Over Under doesn't match First Half Over Under
    [InlineData(SubIssueTypeConstant.FirstHalfOverUnder, BetTypeConstant.OverUnder, false)]  // First Half Over Under doesn't match Over Under
    public void IsAnyLinkedOddsByBetTypeForWrongOdds_ShouldReturnExpectedResult(
        int subIssueTypeId,
        int betType,
        bool expected)
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = betType } }
        };
        
        var getLinkedLogModel = new GetLinkedLogModel 
        { 
            SubIssueTypeId = subIssueTypeId
        };

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsAnyLinkedOddsByBetTypeForWrongOdds(linkedOddsInfoDic, getLinkedLogModel);

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

    [Fact]
    public void IsAnyLinkedOddsByBetTypeForWrongOdds_WithInvalidSubIssueType_ShouldReturnFalse()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = BetTypeConstant.Handicap } }
        };
        
        var getLinkedLogModel = new GetLinkedLogModel 
        { 
            SubIssueTypeId = 999 // Invalid SubIssueType
        };

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsAnyLinkedOddsByBetTypeForWrongOdds(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData(SubIssueTypeConstant.WrongHDP, BetTypeConstant.Handicap, "1.5", null, 1.5, true)]  // Home favorite matches
    [InlineData(SubIssueTypeConstant.WrongHDP, BetTypeConstant.Handicap, null, "1.5", 1.5, true)]  // Away favorite matches
    [InlineData(SubIssueTypeConstant.WrongHDP, BetTypeConstant.Handicap, "1.5", null, 2.0, false)] // Home favorite doesn't match
    [InlineData(SubIssueTypeConstant.WrongHDP, BetTypeConstant.Handicap, null, "1.5", 2.0, false)] // Away favorite doesn't match
    [InlineData(SubIssueTypeConstant.WrongHDPHomeVirtualHeadReversed, BetTypeConstant.Handicap, null, null, 1.5, true, "1.5")] // Home virtual head reversed matches
    [InlineData(SubIssueTypeConstant.WrongHDPAwayVirtualHeadReversed, BetTypeConstant.Handicap, null, null, 1.5, true, "1.5")] // Away virtual head reversed matches
    [InlineData(SubIssueTypeConstant.WrongHDPHomeVirtualHeadReversed, BetTypeConstant.Handicap, null, null, 2.0, false, "1.5")] // Home virtual head reversed doesn't match
    [InlineData(SubIssueTypeConstant.WrongHDPAwayVirtualHeadReversed, BetTypeConstant.Handicap, null, null, 2.0, false, "1.5")] // Away virtual head reversed doesn't match
    [InlineData(SubIssueTypeConstant.WrongHDP, BetTypeConstant.OverUnder, "1.5", null, 1.5, false)] // Wrong bet type
    [InlineData(999, BetTypeConstant.Handicap, "1.5", null, 1.5, false)] // Invalid sub issue type
    public void IsAffectedLinkedOddsForWrongHdp_ShouldReturnExpectedResult(
        int subIssueTypeId,
        int betType,
        string? homeFavorite,
        string? awayFavorite,
        decimal hdp1,
        bool expected,
        string? hdpValue = null)
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = betType, Hdp1 = hdp1 } }
        };
        
        var getLinkedLogModel = new GetLinkedLogModel 
        { 
            SubIssueTypeId = subIssueTypeId,
            HomeFavorite = homeFavorite,
            AwayFavorite = awayFavorite,
            HdpValue = hdpValue
        };

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsAffectedLinkedOddsForWrongHdp(linkedOddsInfoDic, getLinkedLogModel);

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

    [Theory]
    [InlineData("1.5&2.0", null, 1.5, true)]  // Multiple home favorites, matches first value
    [InlineData("1.5&2.0", null, 2.0, true)]  // Multiple home favorites, matches second value
    [InlineData(null, "1.5&2.0", 1.5, true)]  // Multiple away favorites, matches first value
    [InlineData(null, "1.5&2.0", 2.0, true)]  // Multiple away favorites, matches second value
    public void IsAffectedLinkedOddsForWrongHdp_WithMultipleFavorites_ShouldReturnExpectedResult(
        string? homeFavorite,
        string? awayFavorite,
        decimal hdp1,
        bool expected)
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = BetTypeConstant.Handicap, Hdp1 = hdp1 } }
        };
        
        var getLinkedLogModel = new GetLinkedLogModel 
        { 
            SubIssueTypeId = SubIssueTypeConstant.WrongHDP,
            HomeFavorite = homeFavorite,
            AwayFavorite = awayFavorite
        };

        // Act
        var service = new LinkedLogValidationServiceImp();
        var result = service.IsAffectedLinkedOddsForWrongHdp(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.Equal(expected, result);
    }
} 