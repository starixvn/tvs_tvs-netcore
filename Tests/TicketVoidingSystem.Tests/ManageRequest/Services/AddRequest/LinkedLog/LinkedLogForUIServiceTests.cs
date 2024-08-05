using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.IdentityModel.Tokens;
using NSubstitute;
using NSubstitute.Extensions;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LinkedLog;

public class LinkedLogForUIServiceTests
{
    private readonly LinkedLogForUIServiceImp linkedLogForUiService;

    public LinkedLogForUIServiceTests()
    {
        linkedLogForUiService = new LinkedLogForUIServiceImp();
    }

    #region Build

    [Fact]
    public void Build_NoResponseLogs_ReturnsDefaultGroups()
    {
        // Arrange
        var response = new GroupLinkedLogResponse
        {
            AffectedLog = Enumerable.Empty<PoolHouseLinkedLogResponse>(),
            NotAffectedLog = Enumerable.Empty<PoolHouseLinkedLogResponse>()
        };

        // Act
        var result = linkedLogForUiService.Build(response, IssueTypeConstant.WrongHDP, 1);

        // Assert
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public void Build_OnlyAffectedLogs_ReturnsOnlyAffectedGroupsHaveData()
    {
        // Arrange
        var response = new GroupLinkedLogResponse
        {
            AffectedLog = new List<PoolHouseLinkedLogResponse> { new() { LinkGroup = 1, HomeScore = 11, AwayScore = 22, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() } },
            NotAffectedLog = Enumerable.Empty<PoolHouseLinkedLogResponse>()
        };

        // Act
        var result = linkedLogForUiService.Build(response, IssueTypeConstant.WrongHDP, 1);
        var affectedGroup = result.Where(x => x.IsAffectedGroup && x.LogsData.Any(y => y.Contains("Score[11:22]")));
        var notAffectedGroup = result.Where(x => !x.IsAffectedGroup && x.LogsData.IsNullOrEmpty());
        // Assert
        Assert.Equal(2, result.Count());
        Assert.Single(affectedGroup);
        Assert.Single(notAffectedGroup);
    }

    [Fact]
    public void Build_OnlyNotAffectedLogs_ReturnsNotAffectedGroups()
    {
        // Arrange
        var response = new GroupLinkedLogResponse
        {
            AffectedLog = Enumerable.Empty<PoolHouseLinkedLogResponse>(),
            NotAffectedLog = new List<PoolHouseLinkedLogResponse> { new() { LinkGroup = 2, HomeScore = 33, AwayScore = 44, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() } }
        };

        // Act
        var result = linkedLogForUiService.Build(response, IssueTypeConstant.WrongHDP, 1);
        var notAffectedGroupHaveData = result.Where(x => !x.IsAffectedGroup && !x.LogsData.IsNullOrEmpty() && x.LogsData.Any(y => y.Contains("Score[33:44]")));
        var notAffectedGroupDefault = result.Where(x => !x.IsAffectedGroup && x.LogsData.IsNullOrEmpty());

        // Assert
        Assert.Equal(2, result.Count());
        Assert.Single(notAffectedGroupDefault);
        Assert.Single(notAffectedGroupHaveData);
    }

    [Fact]
    public void Build_BothAffectedAndNotAffectedLogs_ReturnsCombinedGroups()
    {
        // Arrange
        var response = new GroupLinkedLogResponse
        {
            AffectedLog = new List<PoolHouseLinkedLogResponse> { new() { LinkGroup = 1, HomeScore = 11, AwayScore = 22, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() } },
            NotAffectedLog = new List<PoolHouseLinkedLogResponse> { new() { LinkGroup = 2, HomeScore = 33, AwayScore = 44, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() } }
        };

        // Act
        var result = linkedLogForUiService.Build(response, IssueTypeConstant.WrongHDP, 1);
        var affectedGroup = result.Where(x => x.IsAffectedGroup && x.LogsData.Any(y => y.Contains("Score[11:22]")));
        var notAffectedGroup = result.Where(x => !x.IsAffectedGroup && x.LogsData.Any(y => y.Contains("Score[33:44]")));
        // Assert
        Assert.Equal(2, result.Count());
        Assert.Single(affectedGroup);
        Assert.Single(notAffectedGroup);
    }

    [Fact]
    public void Build_NotAffectedExistsInAffectedLogs_ReturnsOnlyAffectedGroup()
    {
        // Arrange
        var response = new GroupLinkedLogResponse
        {
            AffectedLog = new List<PoolHouseLinkedLogResponse> { new() { LinkGroup = 1, HomeScore = 11, AwayScore = 22, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() } },
            NotAffectedLog = new List<PoolHouseLinkedLogResponse>
            {
                new() { LinkGroup = 1, HomeScore = 33, AwayScore = 44, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() },
                new() { LinkGroup = 1, HomeScore = 55, AwayScore = 66, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() }
            }
        };

        // Act
        var result = linkedLogForUiService.Build(response, IssueTypeConstant.WrongHDP, 1);
        var affectedGroup = result.Where(x => x.IsAffectedGroup && x.LogsData.Any(y => y.Contains("Score[11:22]")));
        var notAffectedGroup = result.Where(x => !x.IsAffectedGroup && x.LogsData.IsNullOrEmpty());
        // Assert
        Assert.Equal(2, result.Count());
        Assert.Single(affectedGroup);
        Assert.Single(notAffectedGroup);
    }

    #endregion Build

    #region BuildByLinkGroup

    [Fact]
    public void BuildByLinkGroup_EmptyLogs_ReturnsEmpty()
    {
        // Arrange
        var responseLogs = new List<PoolHouseLinkedLogResponse>();

        var service = new LinkedLogForUIServiceImp();

        // Act
        var result = service.BuildByLinkGroup(true, responseLogs, 1, 1);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public void BuildByLinkGroup_SingleGroup_ReturnsSingleGroup()
    {
        // Arrange
        var responseLogs = new List<PoolHouseLinkedLogResponse>
        {
            new () { LinkGroup = 1, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo> ()},
        };
        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();
        service.Configure().BuildLogsData(default, default, default)
            .ReturnsForAnyArgs("abc");
        service.Configure().GetGroupNameById(default)
            .ReturnsForAnyArgs("nameXyz");

        // Act
        var result = service.BuildByLinkGroup(true, responseLogs, 1, 1);

        // Assert
        Assert.Single(result);
        Assert.True(result.First().IsAffectedGroup);
        Assert.Equal("nameXyz", result.First().GroupName);
        Assert.Single(result.First().LogsData);
        Assert.Equal("abc", result.First().LogsData.First());
    }

    [Fact]
    public void BuildByLinkGroup_MultipleGroups_ReturnsGroupedLogs()
    {
        // Arrange
        var responseLogs = new List<PoolHouseLinkedLogResponse>
        {   new() { LinkGroup = 2 , LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo> ()},
            new() { LinkGroup = 1, HomeScore = 12, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo> () },
            new() { LinkGroup = 1, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo> () }
        };
        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();
        service.Configure().BuildLogsData(default, default, default)
            .ReturnsForAnyArgs("xxx");
        service.Configure().BuildLogsData(Arg.Is<PoolHouseLinkedLogResponse>(x => x.HomeScore == 12), Arg.Any<int>(), Arg.Any<int>())
            .Returns("abc");
        service.Configure().GetGroupNameById(Arg.Is<int>(x => x == 1))
            .Returns("Group 1");
        service.Configure().GetGroupNameById(Arg.Is<int>(x => x == 2))
            .Returns("Group 2");

        // Act
        var result = service.BuildByLinkGroup(true, responseLogs, 1, 1);

        // Assert
        Assert.Equal(2, result.Count());
        Assert.All(result, group => Assert.True(group.IsAffectedGroup));
        Assert.Equal("Group 2", result.First().GroupName);
        Assert.Equal("Group 1", result.Last().GroupName);
        Assert.Single(result.Last().LogsData);
        Assert.Equal("abc", result.Last().LogsData.First());
    }

    [Fact]
    public void BuildByLinkGroup_DifferentGroupFlags_ReturnsCorrectGroupFlags()
    {
        // Arrange
        var responseLogs = new List<PoolHouseLinkedLogResponse>
        {
            new() { LinkGroup = 1 },
            new() { LinkGroup = 2 }
        };
        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();
        service.Configure().BuildLogsData(default, default, default)
            .ReturnsForAnyArgs("abc");
        service.Configure().GetGroupNameById(default)
            .ReturnsForAnyArgs("nameXyz");

        // Act
        var affectedResult = service.BuildByLinkGroup(true, responseLogs, 1, 1);
        var notAffectedResult = service.BuildByLinkGroup(false, responseLogs, 1, 1);

        // Assert
        Assert.All(affectedResult, group => Assert.True(group.IsAffectedGroup));
        Assert.All(notAffectedResult, group => Assert.False(group.IsAffectedGroup));
    }

    #endregion BuildByLinkGroup

    #region AddDefaultGroupForDisplay

    [Fact]
    public void AddDefaultGroupForDisplay_EmptyList_AddsDefaultGroups()
    {
        // Arrange
        var groupLinkedLogUI = new List<GroupLinkedLogUI>();
        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();
        service.Configure().Get1X2GroupNameForIssueType(default, default)
            .ReturnsForAnyArgs("abc");

        // Act
        service.AddDefaultGroupForDisplay(groupLinkedLogUI, 1, 1);

        // Assert
        Assert.Equal(2, groupLinkedLogUI.Count);
        Assert.Equal("abc", groupLinkedLogUI[0].GroupName);
        Assert.Equal(LinkedLogApiConstant.GroupNameAio, groupLinkedLogUI[1].GroupName);
    }

    [Theory]
    [InlineData(LinkedLogApiConstant.GroupName1X2)]
    [InlineData(LinkedLogApiConstant.GroupName1H1X2)]
    public void AddDefaultGroupForDisplay_Contains1X2Or1H1X2_AddsAioIfOnlyOne(string groupName)
    {
        // Arrange
        var groupLinkedLogUI = new List<GroupLinkedLogUI>
        {
            new () { GroupName = groupName }
        };
        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();

        // Act
        service.AddDefaultGroupForDisplay(groupLinkedLogUI, 1, 1);

        // Assert
        Assert.Equal(2, groupLinkedLogUI.Count);
        Assert.Equal(groupName, groupLinkedLogUI[0].GroupName);
        Assert.Equal(LinkedLogApiConstant.GroupNameAio, groupLinkedLogUI[1].GroupName);
    }

    [Fact]
    public void AddDefaultGroupForDisplay_ContainsAio_Adds1X2Or1H1X2IfOnlyOne()
    {
        // Arrange
        var groupLinkedLogUI = new List<GroupLinkedLogUI>
        {
            new () { GroupName = LinkedLogApiConstant.GroupNameAio }
        };
        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();
        service.Configure().Get1X2GroupNameForIssueType(default, default)
            .ReturnsForAnyArgs("abc");

        // Act
        service.AddDefaultGroupForDisplay(groupLinkedLogUI, 1, 1);

        // Assert
        Assert.Equal(2, groupLinkedLogUI.Count);
        Assert.Equal(LinkedLogApiConstant.GroupNameAio, groupLinkedLogUI[0].GroupName);
        Assert.Equal("abc", groupLinkedLogUI[1].GroupName);
    }

    [Theory]
    [InlineData(LinkedLogApiConstant.GroupName1X2, LinkedLogApiConstant.GroupName1H1X2)]
    [InlineData(LinkedLogApiConstant.GroupName1X2, LinkedLogApiConstant.GroupName1X2)]
    [InlineData(LinkedLogApiConstant.GroupName1H1X2, LinkedLogApiConstant.GroupName1H1X2)]
    [InlineData(LinkedLogApiConstant.GroupName1X2, LinkedLogApiConstant.GroupNameAio)]
    [InlineData(LinkedLogApiConstant.GroupNameAio, LinkedLogApiConstant.GroupNameAio)]
    public void AddDefaultGroupForDisplay_MultipleGroups_NoChanges(params string[] data)
    {
        // Arrange
        var groupLinkedLogUI = new List<GroupLinkedLogUI>
        {
            new () { GroupName = data[0] },
            new () { GroupName = data[1] }
        };
        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();

        // Act
        service.AddDefaultGroupForDisplay(groupLinkedLogUI, 1, 1);

        // Assert
        Assert.Equal(2, groupLinkedLogUI.Count);
        Assert.Equal(data[0], groupLinkedLogUI[0].GroupName);
        Assert.Equal(data[1], groupLinkedLogUI[1].GroupName);
    }

    #endregion AddDefaultGroupForDisplay

    #region Get1X2GroupNameForIssueType

    [Theory]
    [InlineData(IssueTypeConstant.WrongHDP, 0, LinkedLogApiConstant.GroupName1X2)]
    [InlineData(IssueTypeConstant.WrongOU, 0, LinkedLogApiConstant.GroupName1X2)]
    [InlineData(IssueTypeConstant.Wrong1stHDP, 0, LinkedLogApiConstant.GroupName1H1X2)]
    [InlineData(IssueTypeConstant.Wrong1stOU, 0, LinkedLogApiConstant.GroupName1H1X2)]
    [InlineData(IssueTypeConstant.WrongOdds, SubIssueTypeConstant.Handicap, LinkedLogApiConstant.GroupName1X2)]
    [InlineData(IssueTypeConstant.WrongOdds, SubIssueTypeConstant.OverUnder, LinkedLogApiConstant.GroupName1X2)]
    [InlineData(IssueTypeConstant.WrongOdds, 999, LinkedLogApiConstant.GroupName1H1X2)]
    [InlineData(999, 0, "")]
    public void Get1X2GroupNameForIssueType_VariousInputs_ReturnsExpected(int issueTypeId, int subIssueTypeId, string expected)
    {
        // Arrange
        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();

        // Act
        var result = service.Get1X2GroupNameForIssueType(issueTypeId, subIssueTypeId);

        // Assert
        Assert.Equal(expected, result);
    }

    #endregion Get1X2GroupNameForIssueType

    #region GetGroupNameById

    [Theory]
    [InlineData(LinkedLogApiConstant.GroupId1X2, LinkedLogApiConstant.GroupName1X2)]
    [InlineData(LinkedLogApiConstant.GroupIdAio, LinkedLogApiConstant.GroupNameAio)]
    [InlineData(LinkedLogApiConstant.GroupId1H1X2, LinkedLogApiConstant.GroupName1H1X2)]
    [InlineData(999, "")]
    public void GetGroupNameById_VariousInputs_ReturnsExpected(int groupId, string expected)
    {
        // Arrange
        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();

        // Act
        var result = service.GetGroupNameById(groupId);

        // Assert
        Assert.Equal(expected, result);
    }

    #endregion GetGroupNameById

    #region BuildLogsData

    [Fact]
    public void BuildLogsData_ValidResponse_ReturnsExpectedString()
    {
        // Arrange
        var response = new PoolHouseLinkedLogResponse
        {
            Time = new DateTimeOffset(2024, 7, 31, 15, 45, 0, TimeSpan.FromHours(7)).DateTime,
            HomeScore = 2,
            AwayScore = 1,
            LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo> { { 1, new LinkedOddsInfo() } }
        };
        const int issueTypeId = 1;
        const int subIssueTypeId = 1;

        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();
        service.Configure().BuildHdp(response.LinkedOddsInfoDic, issueTypeId, subIssueTypeId).Returns("HDP_Result");
        service.Configure().BuildOu(response.LinkedOddsInfoDic, issueTypeId, subIssueTypeId).Returns("OU_Result");

        const string expected = "07/31/2024 03:45:00 PM, Score[2:1], HDP_Result, OU_Result";

        // Act
        var result = service.BuildLogsData(response, issueTypeId, subIssueTypeId);

        // Assert
        Assert.Equal(expected, result);
    }

    #endregion BuildLogsData

    #region BuildHdp

    [Fact]
    public void BuildHdp_ValidInput_ReturnsExpectedString()
    {
        // Arrange
        var linkedOddsInfoDictionary = new Dictionary<int, LinkedOddsInfo> {
            { 1, new LinkedOddsInfo { Hdp1 = 1.5m, Hdp2 = 2.5m, Odds1a = 1.9m, Odds2a = 2.1m } },
            { 2, new LinkedOddsInfo { Hdp1 = 5.5m, Hdp2 = 6.5m, Odds1a = 5.9m, Odds2a = 6.1m } }
        };
        const int issueTypeId = 1;
        const int subIssueTypeId = 1;
        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();
        service.Configure().IsValidBetTypeBuildHdp(linkedOddsInfoDictionary.First().Value, issueTypeId, subIssueTypeId).Returns(true);

        // Act
        var result = service.BuildHdp(linkedOddsInfoDictionary, issueTypeId, subIssueTypeId);

        // Assert
        Assert.Equal("HDP[1.5:2.5](1.9:2.1)", result);
    }

    [Fact]
    public void BuildHdp_InvalidInput_ReturnsEmptyString()
    {
        // Arrange
        var linkedOddsInfoDictionary = new Dictionary<int, LinkedOddsInfo>();
        const int issueTypeId = 1;
        const int subIssueTypeId = 1;
        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();

        // Act
        var result = service.BuildHdp(linkedOddsInfoDictionary, issueTypeId, subIssueTypeId);

        // Assert
        Assert.Empty(result);
    }

    #endregion BuildHdp

    #region BuildOu

    [Fact]
    public void BuildOu_ValidInput_ReturnsExpectedString()
    {
        // Arrange
        var linkedOddsInfoDictionary = new Dictionary<int, LinkedOddsInfo> {
            { 1, new LinkedOddsInfo { Hdp1 = 1.5m, Odds1a = 1.9m, Odds2a = 2.1m } },
            { 2, new LinkedOddsInfo { Hdp1 = 5.5m, Hdp2 = 6.5m, Odds1a = 5.9m, Odds2a = 6.1m } }
        };
        const int issueTypeId = 1;
        const int subIssueTypeId = 1;
        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();
        service.Configure().IsValidBetTypeBuildOu(linkedOddsInfoDictionary.First().Value, issueTypeId, subIssueTypeId).Returns(true);

        // Act
        var result = service.BuildOu(linkedOddsInfoDictionary, issueTypeId, subIssueTypeId);

        // Assert
        Assert.Equal("OU[1.5](1.9:2.1)", result);
    }

    [Fact]
    public void BuildOu_InvalidInput_ReturnsEmptyString()
    {
        // Arrange
        var linkedOddsInfoDictionary = new Dictionary<int, LinkedOddsInfo>();
        const int issueTypeId = 1;
        const int subIssueTypeId = 1;
        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();

        // Act
        var result = service.BuildOu(linkedOddsInfoDictionary, issueTypeId, subIssueTypeId);

        // Assert
        Assert.Empty(result);
    }

    #endregion BuildOu

    #region IsValidBetTypeBuildHdp

    [Theory]
    [InlineData(IssueTypeConstant.WrongHDP, BetTypeConstant.Handicap, 0, true)]
    [InlineData(IssueTypeConstant.WrongOU, BetTypeConstant.Handicap, 0, true)]
    [InlineData(IssueTypeConstant.Wrong1stHDP, BetTypeConstant.FirstHalfHandicap, 0, true)]
    [InlineData(IssueTypeConstant.Wrong1stOU, BetTypeConstant.FirstHalfHandicap, 0, true)]
    [InlineData(IssueTypeConstant.WrongOdds, BetTypeConstant.Handicap, SubIssueTypeConstant.Handicap, true)]
    [InlineData(IssueTypeConstant.WrongOdds, BetTypeConstant.FirstHalfHandicap, 0, true)]
    [InlineData(IssueTypeConstant.WrongHDP, BetTypeConstant.OverUnder, 0, false)]
    [InlineData(IssueTypeConstant.WrongOU, BetTypeConstant.FirstHalfHandicap, 0, false)]
    public void IsValidBetTypeBuildHdp_VariousInputs_ReturnsExpected(int issueTypeId, int betType, int subIssueTypeId, bool expected)
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { BetType = betType };
        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();

        // Act
        var result = service.IsValidBetTypeBuildHdp(linkedOddsInfo, issueTypeId, subIssueTypeId);

        // Assert
        Assert.Equal(expected, result);
    }

    #endregion IsValidBetTypeBuildHdp

    #region IsValidBetTypeBuildOu

    [Theory]
    [InlineData(IssueTypeConstant.WrongHDP, BetTypeConstant.OverUnder, 0, true)]
    [InlineData(IssueTypeConstant.WrongOU, BetTypeConstant.OverUnder, 0, true)]
    [InlineData(IssueTypeConstant.Wrong1stHDP, BetTypeConstant.FirstHalfOverUnder, 0, true)]
    [InlineData(IssueTypeConstant.Wrong1stOU, BetTypeConstant.FirstHalfOverUnder, 0, true)]
    [InlineData(IssueTypeConstant.WrongOdds, BetTypeConstant.OverUnder, SubIssueTypeConstant.Handicap, true)]
    [InlineData(IssueTypeConstant.WrongOdds, BetTypeConstant.FirstHalfOverUnder, 0, true)]
    [InlineData(IssueTypeConstant.WrongHDP, BetTypeConstant.Handicap, 0, false)]
    [InlineData(IssueTypeConstant.WrongOU, BetTypeConstant.FirstHalfHandicap, 0, false)]
    public void IsValidBetTypeBuildOu_VariousInputs_ReturnsExpected(int issueTypeId, int betType, int subIssueTypeId, bool expected)
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { BetType = betType };
        var service = Substitute.ForPartsOf<LinkedLogForUIServiceImp>();

        // Act
        var result = service.IsValidBetTypeBuildOu(linkedOddsInfo, issueTypeId, subIssueTypeId);

        // Assert
        Assert.Equal(expected, result);
    }

    #endregion IsValidBetTypeBuildOu
}