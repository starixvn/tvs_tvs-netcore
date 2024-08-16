using System.Collections.Generic;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest;

public class MatchInfoAddRequestServiceTests
{
    private readonly RemotingRefWrapperService remotingRefService;
    private readonly MatchInfoAddRequestServiceImp service;

    public MatchInfoAddRequestServiceTests()
    {
        remotingRefService = Substitute.For<RemotingRefWrapperService>();
        service = new MatchInfoAddRequestServiceImp(remotingRefService);
    }

    [Fact]
    public void UpdateDataFromRemotingRef_HasMatchInfoIsNull_ReturnNull()
    {
        // Arrange
        // Act
        var actual = service.UpdateDataFromRemotingRef((MatchInfoAddRequest)null);

        // Assert
        Assert.Null(actual);
    }

    [Theory]
    [InlineData(true, "123 (N)", 161, "Number Game No.1", false)]
    [InlineData(false, "123", 160, "Lucky 3 Game No.1", false)]
    [InlineData(false, "123", 1, "123 - vs - 456", false)]
    [InlineData(false, "123", 1, "123 - 123", true)]
    [InlineData(false, "123", 164, "Happy 5 No.1", false)]
    [InlineData(false, "123", 207, "1 - vs - 2", false)]
    public void UpdateDataFromRemotingRef_HasMatchInfo_ReturnExpected(bool isNeutral, string homeName,
        int sportType, string matchEvent, bool isOutright)
    {
        // Arrange
        var matchInfo = new MatchInfoAddRequest
        {
            IsNeutral = isNeutral,
            HomeId = 1,
            AwayId = 2,
            MatchId = 1,
            LeagueId = 1,
            SportType = sportType,
            MatchCode = "1",
            IsOutright = isOutright
        };
        remotingRefService.GetTeamName(sportType, matchInfo.HomeId, LanguageCode.English).Returns("123");
        remotingRefService.GetTeamName(sportType, matchInfo.AwayId, LanguageCode.English).Returns("456");
        remotingRefService.GetLeagueName(sportType, matchInfo.LeagueId, LanguageCode.English).ReturnsForAnyArgs("123");
        remotingRefService.GetBFName(matchInfo.HomeId).Returns("1");
        remotingRefService.GetBFName(matchInfo.AwayId).Returns("2");
        var expected = new MatchInfoAddRequest
        {
            IsNeutral = isNeutral,
            HomeId = 1,
            AwayId = 2,
            MatchId = 1,
            LeagueId = 1,
            HomeName = homeName,
            AwayName = "456",
            MatchEvent = matchEvent,
            Name = $"{matchInfo.MatchId} - {matchEvent}",
            LeagueName = "123",
            SportType = sportType,
            MatchCode = "1",
            IsOutright = isOutright
        };

        // Act
        var actual = service.UpdateDataFromRemotingRef(matchInfo);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public void UpdateDataFromRemotingRef_HasListMatchInfo_ReturnExpected()
    {
        // Arrange
        var matchInfo = new MatchInfoAddRequest
        { IsNeutral = true, HomeId = 1, AwayId = 2, MatchId = 1, LeagueId = 1, SportType = 161, MatchCode = "1" };
        remotingRefService.GetTeamName(161, matchInfo.HomeId, LanguageCode.English).Returns("123");
        remotingRefService.GetTeamName(161, matchInfo.AwayId, LanguageCode.English).Returns("456");
        remotingRefService.GetLeagueName(161, matchInfo.LeagueId, LanguageCode.English).ReturnsForAnyArgs("123");
        var expected = new MatchInfoAddRequest
        {
            IsNeutral = true,
            HomeId = 1,
            AwayId = 2,
            MatchId = 1,
            LeagueId = 1,
            HomeName = "123 (N)",
            AwayName = "456",
            MatchEvent = "Number Game No.1",
            Name = $"{matchInfo.MatchId} - Number Game No.1",
            LeagueName = "123",
            SportType = 161,
            MatchCode = "1"
        };

        // Act
        var actual = service.UpdateDataFromRemotingRef(new List<MatchInfoAddRequest> { matchInfo });

        // Assert
        AssertExtension.Equal(new List<MatchInfoAddRequest> { expected }, actual);
    }
}