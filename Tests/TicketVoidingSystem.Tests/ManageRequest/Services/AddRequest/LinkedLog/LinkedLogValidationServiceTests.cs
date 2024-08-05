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
    [InlineData("1.0&2.5&3.5", 2.5, true)]
    [InlineData("1.0&2.5&3.5", 4.5, false)]
    [InlineData(null, 2.5, false)]
    [InlineData("", 2.5, false)]
    public void IsContainsValue_ReturnsExpectedResult(string parent, double child, bool expected)
    {
        // Arrange
        var childDecimal = (decimal)child;
        var service = new LinkedLogValidationServiceImp();

        // Act
        var result = service.IsContainsValue(parent, childDecimal);

        // Assert
        Assert.Equal(expected, result);
    }

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

    #region IsAffectedLinkedOddsForWrongHdp

    [Fact]
    public void IsAffectedLinkedOddsForWrongHdp_ShouldReturnTrue_WhenConditionMet()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = BetTypeConstant.Handicap } }
        };
        var getLinkedLogModel = new GetLinkedLogModel();
        var service = Substitute.ForPartsOf<LinkedLogValidationServiceImp>();
        service.Configure().CheckLinkedOddsForWrongHdp1stHdpBySubIssueType(Arg.Any<LinkedOddsInfo>(), Arg.Any<GetLinkedLogModel>()).Returns(true);

        // Act
        var result = service.IsAffectedLinkedOddsForWrongHdp(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsAffectedLinkedOddsForWrongHdp_ShouldReturnFalse_WhenConditionNotMet()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = BetTypeConstant.Handicap } }
        };
        var getLinkedLogModel = new GetLinkedLogModel();
        var service = Substitute.ForPartsOf<LinkedLogValidationServiceImp>();
        service.Configure().CheckLinkedOddsForWrongHdp1stHdpBySubIssueType(Arg.Any<LinkedOddsInfo>(), Arg.Any<GetLinkedLogModel>()).Returns(false);

        // Act
        var result = service.IsAffectedLinkedOddsForWrongHdp(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void IsAffectedLinkedOddsForWrongHdp_ShouldReturnFalse_WhenDictionaryEmpty()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>();
        var getLinkedLogModel = new GetLinkedLogModel();
        var service = new LinkedLogValidationServiceImp();

        // Act
        var result = service.IsAffectedLinkedOddsForWrongHdp(linkedOddsInfoDic, getLinkedLogModel);

        // Assert
        Assert.False(result);
    }

    #endregion IsAffectedLinkedOddsForWrongHdp

    #region IsAffectedLinkedOddsForWrong1stHdp

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

    #endregion IsAffectedLinkedOddsForWrong1stHdp

    #region CheckLinkedOddsForWrongHdp1stHdpBySubIssueType

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

    #endregion CheckLinkedOddsForWrongHdp1stHdpBySubIssueType
}