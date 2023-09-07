using System;
using System.Collections.Generic;
using System.Linq;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LinkedLog;

public class FilterLinkedLogServiceTests
{
    private readonly OddsInfoValidationService oddsInfoValidationService;
    private readonly FilterLinkedLogServiceImp service;

    public FilterLinkedLogServiceTests()
    {
        oddsInfoValidationService = Substitute.For<OddsInfoValidationService>();
        service = new FilterLinkedLogServiceImp(oddsInfoValidationService);
    }

    [Theory]
    [InlineData(IssueTypeConstant.WrongHDP, BetTypeConstant.Handicap)]
    [InlineData(IssueTypeConstant.Wrong1stHDP, BetTypeConstant.FirstHalfHandicap)]
    [InlineData(IssueTypeConstant.WrongOU, BetTypeConstant.OverUnder)]
    [InlineData(IssueTypeConstant.Wrong1stOU, BetTypeConstant.FirstHalfOverUnder)]
    public void FilterApiResponse_ValidData_ReturnExpected(int issueTypeId, int betType)
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>();
        linkedOddsInfoDic.Add(1, new LinkedOddsInfo { BetType = betType, Hdp1 = 1 });
        linkedOddsInfoDic.Add(2, new LinkedOddsInfo { BetType = BetTypeConstant.MixParlay, Hdp1 = 1 });
        linkedOddsInfoDic.Add(3, new LinkedOddsInfo { BetType = betType, Hdp1 = 2 });
        var getLinkedLogModel = new GetLinkedLogModel
            { IssueTypeId = issueTypeId, FilterToTransTime = new DateTime(2022, 2, 2, 2, 2, 2) };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>
        {
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupIdAio,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1H1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            }
        };
        oddsInfoValidationService.IsValidFavoriteWrongHdp1StHdp(Arg.Any<LinkedOddsInfo>(), Arg.Any<GetLinkedLogModel>())
            .ReturnsForAnyArgs(true);
        oddsInfoValidationService.IsContainsValue(Arg.Any<string>(), 1).Returns(true);
        oddsInfoValidationService.IsContainsValue(Arg.Any<string>(), 2).Returns(false);

        // Act
        var actual = service.FilterApiResponse(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        AssertExtension.Equal(2, actual.Count());
    }

    [Theory]
    [InlineData(IssueTypeConstant.WrongHDP, BetTypeConstant.Handicap)]
    [InlineData(IssueTypeConstant.Wrong1stHDP, BetTypeConstant.FirstHalfHandicap)]
    [InlineData(IssueTypeConstant.WrongOU, BetTypeConstant.OverUnder)]
    [InlineData(IssueTypeConstant.Wrong1stOU, BetTypeConstant.FirstHalfOverUnder)]
    public void FilterApiResponse_NoHasValidData_ReturnExpected(int issueTypeId, int betType)
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>();
        linkedOddsInfoDic.Add(1, new LinkedOddsInfo { BetType = betType, Hdp1 = 1 });
        linkedOddsInfoDic.Add(2, new LinkedOddsInfo { BetType = BetTypeConstant.MixParlay, Hdp1 = 1 });
        linkedOddsInfoDic.Add(3, new LinkedOddsInfo { BetType = betType, Hdp1 = 2 });
        var getLinkedLogModel = new GetLinkedLogModel
            { IssueTypeId = issueTypeId, FilterToTransTime = new DateTime(2022, 2, 2, 2, 2, 2) };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>
        {
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupIdAio,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1H1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            }
        };
        oddsInfoValidationService.IsValidFavoriteWrongHdp1StHdp(Arg.Any<LinkedOddsInfo>(), Arg.Any<GetLinkedLogModel>())
            .ReturnsForAnyArgs(false);
        oddsInfoValidationService.IsContainsValue(Arg.Any<string>(), Arg.Any<decimal>()).ReturnsForAnyArgs(false);

        // Act
        var actual = service.FilterApiResponse(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        AssertExtension.Equal(0, actual.Count());
    }

    [Fact]
    public void FilterApiResponse_WithIssueTypeIdIsWrongOdds_ReturnHasValueExpected()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>();
        linkedOddsInfoDic.Add(1, new LinkedOddsInfo { BetType = 1, Hdp1 = 1 });
        linkedOddsInfoDic.Add(2, new LinkedOddsInfo { BetType = BetTypeConstant.MixParlay, Hdp1 = 1 });
        linkedOddsInfoDic.Add(3, new LinkedOddsInfo { BetType = 1, Hdp1 = 2 });
        var getLinkedLogModel = new GetLinkedLogModel
            { IssueTypeId = IssueTypeConstant.WrongOdds, FilterToTransTime = new DateTime(2022, 2, 2, 2, 2, 2) };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>
        {
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupIdAio,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1H1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            }
        };
        oddsInfoValidationService
            .IsValidLinkGroupWrongOdds(Arg.Any<PoolHouseLinkedLogResponse>(), Arg.Any<GetLinkedLogModel>())
            .ReturnsForAnyArgs(true);
        oddsInfoValidationService.IsValidBetTypeWrongOdds(Arg.Any<int>(), Arg.Any<GetLinkedLogModel>())
            .ReturnsForAnyArgs(true);
        oddsInfoValidationService.IsValidHdpWrongOdds(Arg.Any<LinkedOddsInfo>(), Arg.Any<GetLinkedLogModel>())
            .ReturnsForAnyArgs(true);
        oddsInfoValidationService.IsValidOddsWrongOdds(Arg.Any<LinkedOddsInfo>(), Arg.Any<GetLinkedLogModel>())
            .ReturnsForAnyArgs(true);

        // Act
        var actual = service.FilterApiResponse(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        AssertExtension.Equal(3, actual.Count());
    }

    [Theory]
    [InlineData(false, true, true)]
    [InlineData(true, false, true)]
    [InlineData(true, true, false)]
    public void FilterApiResponse_WithIssueTypeIdIsWrongOdds_ReturnHasNoValue(bool IsValidBetTypeWrongOdds,
        bool IsValidHdpWrongOdds, bool IsValidOddsWrongOdds)
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>();
        linkedOddsInfoDic.Add(1, new LinkedOddsInfo { BetType = 1, Hdp1 = 1 });
        linkedOddsInfoDic.Add(2, new LinkedOddsInfo { BetType = BetTypeConstant.MixParlay, Hdp1 = 1 });
        linkedOddsInfoDic.Add(3, new LinkedOddsInfo { BetType = 1, Hdp1 = 2 });
        var getLinkedLogModel = new GetLinkedLogModel
            { IssueTypeId = IssueTypeConstant.WrongOdds, FilterToTransTime = new DateTime(2022, 2, 2, 2, 2, 2) };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>
        {
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupIdAio,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1H1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            }
        };
        oddsInfoValidationService
            .IsValidLinkGroupWrongOdds(Arg.Any<PoolHouseLinkedLogResponse>(), Arg.Any<GetLinkedLogModel>())
            .ReturnsForAnyArgs(true);
        oddsInfoValidationService.IsValidBetTypeWrongOdds(Arg.Any<int>(), Arg.Any<GetLinkedLogModel>())
            .ReturnsForAnyArgs(IsValidBetTypeWrongOdds);
        oddsInfoValidationService.IsValidHdpWrongOdds(Arg.Any<LinkedOddsInfo>(), Arg.Any<GetLinkedLogModel>())
            .ReturnsForAnyArgs(IsValidHdpWrongOdds);
        oddsInfoValidationService.IsValidOddsWrongOdds(Arg.Any<LinkedOddsInfo>(), Arg.Any<GetLinkedLogModel>())
            .ReturnsForAnyArgs(IsValidOddsWrongOdds);

        // Act
        var actual = service.FilterApiResponse(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        AssertExtension.Equal(0, actual.Count());
    }

    [Fact]
    public void FilterApiResponse_WithIssueTypeIdIsRedCard_ReturnHasNoValue()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>();
        linkedOddsInfoDic.Add(1, new LinkedOddsInfo { BetType = 1, Hdp1 = 1 });
        linkedOddsInfoDic.Add(2, new LinkedOddsInfo { BetType = BetTypeConstant.MixParlay, Hdp1 = 1 });
        linkedOddsInfoDic.Add(3, new LinkedOddsInfo { BetType = 1, Hdp1 = 2 });
        var getLinkedLogModel = new GetLinkedLogModel
            { IssueTypeId = IssueTypeConstant.RedCard, FilterToTransTime = new DateTime(2022, 2, 2, 2, 2, 2) };
        var apiLinkedLogResponses = new List<PoolHouseLinkedLogResponse>
        {
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupIdAio,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1H1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            }
        };

        // Act
        var actual = service.FilterApiResponse(getLinkedLogModel, apiLinkedLogResponses);

        // Assert
        AssertExtension.Equal(0, actual.Count());
    }
}