using System;
using System.Collections.Generic;
using System.Linq;
using NSubstitute;
using NSubstitute.Extensions;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LinkedLog;

public class FilterLinkedLogServiceTests
{
    private readonly LinkedLogValidationService linkedLogValidationService = Substitute.For<LinkedLogValidationService>();

    #region GroupBy

    [Fact]
    public void GroupBy_WrongHDP_ReturnsExpectedResponse()
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { IssueTypeId = IssueTypeConstant.WrongHDP };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>();
        var expectedResponse = new GroupLinkedLogResponse();
        var service = Substitute.ForPartsOf<FilterLinkedLogServiceImp>(linkedLogValidationService);
        service.Configure().GroupBy(getLinkedLogModel, apiLinkedLogResponses).Returns(expectedResponse);

        // Act
        var result = service.GroupBy(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        Assert.Equal(expectedResponse, result);
    }

    [Fact]
    public void GroupBy_Wrong1stHDP_ReturnsExpectedResponse()
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { IssueTypeId = IssueTypeConstant.Wrong1stHDP };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>();
        var expectedResponse = new GroupLinkedLogResponse();
        var service = Substitute.ForPartsOf<FilterLinkedLogServiceImp>(linkedLogValidationService);
        service.Configure().GroupBy(getLinkedLogModel, apiLinkedLogResponses).Returns(expectedResponse);

        // Act
        var result = service.GroupBy(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        Assert.Equal(expectedResponse, result);
    }

    [Fact]
    public void GroupBy_WrongOU_ReturnsExpectedResponse()
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { IssueTypeId = IssueTypeConstant.WrongOU };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>();
        var expectedResponse = new GroupLinkedLogResponse();
        var service = Substitute.ForPartsOf<FilterLinkedLogServiceImp>(linkedLogValidationService);
        service.Configure().GroupBy(getLinkedLogModel, apiLinkedLogResponses).Returns(expectedResponse);

        // Act
        var result = service.GroupBy(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        Assert.Equal(expectedResponse, result);
    }

    [Fact]
    public void GroupBy_Wrong1stOU_ReturnsExpectedResponse()
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { IssueTypeId = IssueTypeConstant.Wrong1stOU };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>();
        var expectedResponse = new GroupLinkedLogResponse();
        var service = Substitute.ForPartsOf<FilterLinkedLogServiceImp>(linkedLogValidationService);
        service.Configure().GroupBy(getLinkedLogModel, apiLinkedLogResponses).Returns(expectedResponse);

        // Act
        var result = service.GroupBy(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        Assert.Equal(expectedResponse, result);
    }

    [Fact]
    public void GroupBy_WrongOdds_ReturnsExpectedResponse()
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { IssueTypeId = IssueTypeConstant.WrongOdds };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>();
        var expectedResponse = new GroupLinkedLogResponse();
        var service = Substitute.ForPartsOf<FilterLinkedLogServiceImp>(linkedLogValidationService);
        service.Configure().GroupBy(getLinkedLogModel, apiLinkedLogResponses).Returns(expectedResponse);

        // Act
        var result = service.GroupBy(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        Assert.Equal(expectedResponse, result);
    }

    [Fact]
    public void GroupBy_UnknownIssueType_ReturnsEmptyResponse()
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { IssueTypeId = 999 };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>();
        var service = Substitute.ForPartsOf<FilterLinkedLogServiceImp>(linkedLogValidationService);

        // Act
        var result = service.GroupBy(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        Assert.NotNull(result);
    }

    #endregion GroupBy

    #region GetLinkedLogWrongHdp

    [Fact]
    public void GetLinkedLogWrongHdp_ReturnsExpectedResponse()
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { IssueTypeId = IssueTypeConstant.WrongHDP, FilterFromTransTime = DateTimeOffset.Now.DateTime };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>
        {
            new() { Time = DateTimeOffset.Now.DateTime.AddMinutes(-10), LinkGroup = 1, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() },
            new() { Time = DateTimeOffset.Now.DateTime.AddMinutes(-20), LinkGroup = 2, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() }
        };

        linkedLogValidationService.IsAffectedLinkTime(Arg.Any<DateTime>(), getLinkedLogModel).Returns(true);
        linkedLogValidationService.IsLinkGroupFullTime(Arg.Any<int>()).Returns(true);
        linkedLogValidationService.IsAffectedLinkedOddsForWrongHdp(Arg.Any<Dictionary<int, LinkedOddsInfo>>(), getLinkedLogModel).Returns(true);
        linkedLogValidationService.IsNotAffectedLinkTime(Arg.Any<DateTime>(), Arg.Any<DateTime>()).Returns(true);
        linkedLogValidationService.IsAnyLinkedOddsByBetType(Arg.Any<Dictionary<int, LinkedOddsInfo>>(), BetTypeConstant.Handicap).Returns(true);
        var service = new FilterLinkedLogServiceImp(linkedLogValidationService);

        // Act
        var result = service.GroupBy(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.AffectedLog.Count());
        Assert.Equal(apiLinkedLogResponses[1].Time, result.AffectedLog.First().Time);

        Assert.Equal(2, result.NotAffectedLog.Count());
        Assert.Equal(apiLinkedLogResponses[0].Time, result.NotAffectedLog.First().Time);
    }

    #endregion GetLinkedLogWrongHdp

    #region GetLinkedLogWrong1stHdp

    [Fact]
    public void GetLinkedLogWrong1stHdp_ReturnsExpectedResponse()
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { IssueTypeId = IssueTypeConstant.Wrong1stHDP, FilterFromTransTime = DateTimeOffset.Now.DateTime };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>
        {
            new() { Time = DateTimeOffset.Now.DateTime.AddMinutes(-10), LinkGroup = 1, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() },
            new() { Time = DateTimeOffset.Now.DateTime.AddMinutes(-20), LinkGroup = 2, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() }
        };

        linkedLogValidationService.IsAffectedLinkTime(Arg.Any<DateTime>(), getLinkedLogModel).Returns(true);
        linkedLogValidationService.IsLinkGroupHalfTime(Arg.Any<int>()).Returns(true);
        linkedLogValidationService.IsAffectedLinkedOddsForWrong1stHdp(Arg.Any<Dictionary<int, LinkedOddsInfo>>(), getLinkedLogModel).Returns(true);
        linkedLogValidationService.IsNotAffectedLinkTime(Arg.Any<DateTime>(), Arg.Any<DateTime>()).Returns(true);
        linkedLogValidationService.IsAnyLinkedOddsByBetType(Arg.Any<Dictionary<int, LinkedOddsInfo>>(), BetTypeConstant.FirstHalfHandicap).Returns(true);
        var service = new FilterLinkedLogServiceImp(linkedLogValidationService);

        // Act
        var result = service.GroupBy(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.AffectedLog.Count());
        Assert.Equal(apiLinkedLogResponses[1].Time, result.AffectedLog.First().Time);

        Assert.Equal(2, result.NotAffectedLog.Count());
        Assert.Equal(apiLinkedLogResponses[0].Time, result.NotAffectedLog.First().Time);
    }

    #endregion GetLinkedLogWrong1stHdp

    #region GetLinkedLogWrongOu

    [Fact]
    public void GetLinkedLogWrongOu_ReturnsExpectedResponse()
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { IssueTypeId = IssueTypeConstant.Wrong1stHDP, FilterFromTransTime = DateTimeOffset.Now.DateTime };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>
        {
            new() { Time = DateTimeOffset.Now.DateTime.AddMinutes(-10), LinkGroup = 1, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() },
            new() { Time = DateTimeOffset.Now.DateTime.AddMinutes(-20), LinkGroup = 2, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() }
        };

        linkedLogValidationService.IsAffectedLinkTime(Arg.Any<DateTime>(), getLinkedLogModel).Returns(true);
        linkedLogValidationService.IsLinkGroupFullTime(Arg.Any<int>()).Returns(true);
        linkedLogValidationService.IsAffectedLinkedOddsForWrongOU(Arg.Any<Dictionary<int, LinkedOddsInfo>>(), getLinkedLogModel).Returns(true);
        linkedLogValidationService.IsNotAffectedLinkTime(Arg.Any<DateTime>(), Arg.Any<DateTime>()).Returns(true);
        linkedLogValidationService.IsAnyLinkedOddsByBetType(Arg.Any<Dictionary<int, LinkedOddsInfo>>(), BetTypeConstant.OverUnder).Returns(true);
        var service = new FilterLinkedLogServiceImp(linkedLogValidationService);

        // Act
        var result = service.GroupBy(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        Assert.NotNull(result);
    }

    #endregion GetLinkedLogWrongOu

    #region GetLinkedLogWrong1stOu

    [Fact]
    public void GetLinkedLogWrong1stOu_ReturnsExpectedResponse()
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { IssueTypeId = IssueTypeConstant.Wrong1stHDP, FilterFromTransTime = DateTimeOffset.Now.DateTime };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>
        {
            new() { Time = DateTimeOffset.Now.DateTime.AddMinutes(-10), LinkGroup = 1, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() },
            new() { Time = DateTimeOffset.Now.DateTime.AddMinutes(-20), LinkGroup = 2, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() }
        };

        linkedLogValidationService.IsAffectedLinkTime(Arg.Any<DateTime>(), getLinkedLogModel).Returns(true);
        linkedLogValidationService.IsLinkGroupHalfTime(Arg.Any<int>()).Returns(true);
        linkedLogValidationService.IsAffectedLinkedOddsForWrong1stOU(Arg.Any<Dictionary<int, LinkedOddsInfo>>(), getLinkedLogModel).Returns(true);
        linkedLogValidationService.IsNotAffectedLinkTime(Arg.Any<DateTime>(), Arg.Any<DateTime>()).Returns(true);
        linkedLogValidationService.IsAnyLinkedOddsByBetType(Arg.Any<Dictionary<int, LinkedOddsInfo>>(), BetTypeConstant.FirstHalfOverUnder).Returns(true);
        var service = new FilterLinkedLogServiceImp(linkedLogValidationService);

        // Act
        var result = service.GroupBy(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        Assert.NotNull(result);
    }

    #endregion GetLinkedLogWrong1stOu

    #region GetLinkedLogWrongOdds

    [Fact]
    public void GetLinkedLogWrongOdds_ReturnsExpectedResponse()
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel
        {
            IssueTypeId = IssueTypeConstant.WrongOdds,
            SubIssueTypeId = SubIssueTypeConstant.Handicap,
            FilterFromTransTime = DateTime.Now
        };

        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>
        {
            new() { Time = DateTimeOffset.Now.DateTime.AddMinutes(-10), LinkGroup = 1, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() },
            new() { Time = DateTimeOffset.Now.DateTime.AddMinutes(-20), LinkGroup = 2, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() }
        };

        linkedLogValidationService.IsAffectedLinkTime(Arg.Any<DateTime>(), getLinkedLogModel).Returns(true);
        linkedLogValidationService.IsLinkGroupWrongOdds(Arg.Any<int>(), Arg.Any<int>()).Returns(true);
        linkedLogValidationService.IsAffectedLinkedOddsForWrongOdds(Arg.Any<Dictionary<int, LinkedOddsInfo>>(), getLinkedLogModel).Returns(true);
        linkedLogValidationService.IsNotAffectedLinkTime(Arg.Any<DateTime>(), Arg.Any<DateTime>()).Returns(true);
        linkedLogValidationService.IsAnyLinkedOddsByBetTypeForWrongOdds(Arg.Any<Dictionary<int, LinkedOddsInfo>>(), getLinkedLogModel).Returns(true);
        var service = new FilterLinkedLogServiceImp(linkedLogValidationService);

        // Act
        var result = service.GroupBy(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.AffectedLog.Count());
        Assert.Equal(apiLinkedLogResponses[1].Time, result.AffectedLog.First().Time);

        Assert.Equal(2, result.NotAffectedLog.Count());
        Assert.Equal(apiLinkedLogResponses[0].Time, result.NotAffectedLog.First().Time);
    }

    #endregion GetLinkedLogWrongOdds
}