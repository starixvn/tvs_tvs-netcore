using System.Collections.Generic;
using System.Linq;
using Microsoft.IdentityModel.Tokens;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LinkedLog;

public class LinkedLogForUIServiceTests
{
    private readonly LinkedLogForUIServiceImp linkedLogForUiService = new();

    [Fact]
    public void Build_NoResponseLogs_ReturnsDefaultGroups()
    {
        // Arrange
        var response = new GroupLinkedLogResponse
        {
            AffectedLog = [],
            NotAffectedLog = []
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
            NotAffectedLog = []
        };

        // Act
        var result = linkedLogForUiService.Build(response, IssueTypeConstant.WrongHDP, 1).ToList();
        var affectedGroup = result.Where(x => x.IsAffectedGroup && x.LogsData.Any(y => y.Contains("Score[11:22]")));
        var notAffectedGroup = result.Where(x => !x.IsAffectedGroup && x.LogsData.IsNullOrEmpty());

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Single(affectedGroup);
        Assert.Single(notAffectedGroup);
    }

    [Fact]
    public void Build_OnlyNotAffectedLogs_ReturnsNotAffectedGroups()
    {
        // Arrange
        var response = new GroupLinkedLogResponse
        {
            AffectedLog = [],
            NotAffectedLog = new List<PoolHouseLinkedLogResponse> { new() { LinkGroup = 2, HomeScore = 33, AwayScore = 44, LinkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>() } }
        };

        // Act
        var result = linkedLogForUiService.Build(response, IssueTypeConstant.WrongHDP, 1).ToList();
        var notAffectedGroupHaveData = result.Where(x => !x.IsAffectedGroup && !x.LogsData.IsNullOrEmpty() && x.LogsData.Any(y => y.Contains("Score[33:44]")));
        var notAffectedGroupDefault = result.Where(x => !x.IsAffectedGroup && x.LogsData.IsNullOrEmpty());

        // Assert
        Assert.Equal(2, result.Count);
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
        var result = linkedLogForUiService.Build(response, IssueTypeConstant.WrongHDP, 1).ToList();
        var affectedGroup = result.Where(x => x.IsAffectedGroup && x.LogsData.Any(y => y.Contains("Score[11:22]")));
        var notAffectedGroup = result.Where(x => !x.IsAffectedGroup && x.LogsData.Any(y => y.Contains("Score[33:44]")));

        // Assert
        Assert.Equal(2, result.Count);
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
        var result = linkedLogForUiService.Build(response, IssueTypeConstant.WrongHDP, 1).ToList();
        var affectedGroup = result.Where(x => x.IsAffectedGroup && x.LogsData.Any(y => y.Contains("Score[11:22]")));
        var notAffectedGroup = result.Where(x => !x.IsAffectedGroup && x.LogsData.IsNullOrEmpty());

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Single(affectedGroup);
        Assert.Single(notAffectedGroup);
    }
}