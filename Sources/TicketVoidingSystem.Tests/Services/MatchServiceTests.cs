using System;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.Services;

public class MatchServiceTests
{
    private readonly IDynamicRepository _repository;
    private readonly RemotingRefWrapperService _remotingRefWrapperService;
    private readonly MatchService _matchService;

    public MatchServiceTests()
    {
        _repository = Substitute.For<IDynamicRepository>();
        _remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
        _matchService = new MatchServiceImp(_repository, _remotingRefWrapperService);
    }

    [Fact]
    public async Task GetMatchAddRequest_WhenSuccessful_ShouldReturnExpectedViewModel()
    {
        // Arrange
        var criteria = new GetMatchInfoAddRequestCriteria 
        { 
            ErrorCode = 0,
            ErrorMsg = "Success"
        };
        var match = new Match { MatchId = 1 };
        _repository.GetAsync<Match>(criteria).Returns(match);

        // Act
        var result = await _matchService.GetMatchAddRequest(criteria);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(match, result.Match);
        Assert.Equal(criteria.ErrorCode, result.ErrorCode);
        Assert.Equal(criteria.ErrorMsg, result.ErrorMsg);
    }

    [Fact]
    public async Task GetMatch_WithCriteria_ShouldCallRepository()
    {
        // Arrange
        var criteria = new GetMatchInfoCriteria { MatchId = 1 };
        var expectedMatch = new Match { MatchId = 1 };
        _repository.GetAsync<Match>(criteria).Returns(expectedMatch);

        // Act
        var result = await _matchService.GetMatch(criteria);

        // Assert
        Assert.Equal(expectedMatch, result);
        await _repository.Received(1).GetAsync<Match>(criteria);
    }

    [Fact]
    public async Task GetMatch_WithMatchId_ShouldCallRepository()
    {
        // Arrange
        var matchId = 1;
        var expectedMatch = new Match { MatchId = matchId };
        _repository.GetAsync<Match>(Arg.Any<GetMatchInfoCriteria>()).Returns(expectedMatch);

        // Act
        var result = await _matchService.GetMatch(matchId);

        // Assert
        Assert.Equal(expectedMatch, result);
        await _repository.Received(1).GetAsync<Match>(Arg.Is<GetMatchInfoCriteria>(c => c.MatchId == matchId));
    }

    [Fact]
    public async Task GetMatchVoidByCurrency_WithCriteria_ShouldCallRepository()
    {
        // Arrange
        var criteria = new GetMatchInfoVoidByCurrencyCriteria { MatchId = 1 };
        var expectedMatch = new Match { MatchId = 1 };
        _repository.GetAsync<Match>(criteria).Returns(expectedMatch);

        // Act
        var result = await _matchService.GetMatchVoidByCurrency(criteria);

        // Assert
        Assert.Equal(expectedMatch, result);
        await _repository.Received(1).GetAsync<Match>(criteria);
    }

    [Fact]
    public async Task GetMatchVoidByCurrency_WithMatchId_ShouldCallRepository()
    {
        // Arrange
        var matchId = 1;
        var expectedMatch = new Match { MatchId = matchId };
        _repository.GetAsync<Match>(Arg.Any<GetMatchInfoVoidByCurrencyCriteria>()).Returns(expectedMatch);

        // Act
        var result = await _matchService.GetMatchVoidByCurrency(matchId);

        // Assert
        Assert.Equal(expectedMatch, result);
        await _repository.Received(1).GetAsync<Match>(Arg.Is<GetMatchInfoVoidByCurrencyCriteria>(c => c.MatchId == matchId));
    }

    [Fact]
    public void UpdateMatchInfoFromRemotingRef_WhenMatchIsNull_ShouldReturnNull()
    {
        // Act
        var result = _matchService.UpdateMatchInfoFromRemotingRef(null);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public void UpdateMatchInfoFromRemotingRef_WhenMatchIsNotNull_ShouldUpdateMatchInfo()
    {
        // Arrange
        var match = new Match 
        { 
            SportType = 1,
            HomeId = 1,
            AwayId = 2,
            LeagueId = 1,
            IsNeutral = true
        };
        _remotingRefWrapperService.GetTeamName(Arg.Any<int>(), Arg.Any<object>(), Arg.Any<string>())
            .Returns("TeamName");
        _remotingRefWrapperService.GetLeagueName(Arg.Any<int>(), Arg.Any<object>(), Arg.Any<string>())
            .Returns("LeagueName");
        _remotingRefWrapperService.GetSportName(Arg.Any<string>(), Arg.Any<string>())
            .Returns("SportName");

        // Act
        var result = _matchService.UpdateMatchInfoFromRemotingRef(match);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("TeamName (N)", result.HomeName);
        Assert.Equal("TeamName", result.AwayName);
        Assert.Equal("LeagueName", result.LeagueName);
        Assert.Equal("SportName", result.SportTypeName);
    }

    [Fact]
    public void GetMatchEvent_ShouldReturnExpectedEventString()
    {
        // Arrange
        var match = new Match 
        { 
            SportType = 1,
            HomeId = 1,
            AwayId = 2,
            IsNeutral = true
        };
        _remotingRefWrapperService.GetTeamName(Arg.Any<int>(), Arg.Any<object>(), Arg.Any<string>())
            .Returns("TeamName");

        // Act
        var result = _matchService.GetMatchEvent(match);

        // Assert
        Assert.Equal("TeamName (N) - vs - TeamName", result);
    }

    [Fact]
    public async Task LockMatch_WhenSuccessful_ShouldReturnSuccessResult()
    {
        // Arrange
        var matchId = 1;
        var type = LockMatchType.Match;
        var lockStatus = LockMatchStatus.Lock;
        var siteDbGroupId = 1;

        var expectedResult = new Result { IsSuccessful = true };
        _repository.GetAsync<Result>(Arg.Any<LockMatchCriteria>()).Returns(expectedResult);

        // Act
        var result = await _matchService.LockMatch(matchId, type, lockStatus, siteDbGroupId);

        // Assert
        Assert.True(result.IsSuccessful);
        await _repository.Received(1).GetAsync<Result>(Arg.Is<LockMatchCriteria>(c => 
            c.MatchId == matchId && 
            c.Type == type && 
            c.Lock == lockStatus && 
            c.SiteDbGroupId == siteDbGroupId));
    }

    [Fact]
    public async Task LockMatch_WhenFailed_ShouldReturnErrorResult()
    {
        // Arrange
        var matchId = 1;
        var type = LockMatchType.Match;
        var lockStatus = LockMatchStatus.Lock;
        var siteDbGroupId = 1;

        var expectedResult = new Result 
        { 
            IsSuccessful = false,
            ErrorCode = 100,
            ErrorMsg = "Match already locked"
        };
        _repository.GetAsync<Result>(Arg.Any<LockMatchCriteria>()).Returns(expectedResult);

        // Act
        var result = await _matchService.LockMatch(matchId, type, lockStatus, siteDbGroupId);

        // Assert
        Assert.False(result.IsSuccessful);
        Assert.Equal(100, result.ErrorCode);
        Assert.Equal("Match already locked", result.ErrorMsg);
    }

    [Fact]
    public async Task LockMatch_WhenLockStatusIsLock_ShouldRetryOnFailure()
    {
        // Arrange
        var matchId = 1;
        var type = LockMatchType.Match;
        var lockStatus = LockMatchStatus.Lock;
        var siteDbGroupId = 1;

        var failedResult = new Result { IsSuccessful = false };
        var successResult = new Result { IsSuccessful = true };
        
        _repository.GetAsync<Result>(Arg.Any<LockMatchCriteria>())
            .Returns(failedResult, failedResult, successResult);

        // Act
        var result = await _matchService.LockMatch(matchId, type, lockStatus, siteDbGroupId);

        // Assert
        Assert.True(result.IsSuccessful);
        await _repository.Received(3).GetAsync<Result>(Arg.Any<LockMatchCriteria>());
    }

    [Fact]
    public async Task LockMatch_WhenLockStatusIsUnlock_ShouldNotRetry()
    {
        // Arrange
        var matchId = 1;
        var type = LockMatchType.Match;
        var lockStatus = LockMatchStatus.UnLock;
        var siteDbGroupId = 1;

        var failedResult = new Result { IsSuccessful = false };
        _repository.GetAsync<Result>(Arg.Any<LockMatchCriteria>()).Returns(failedResult);

        // Act
        var result = await _matchService.LockMatch(matchId, type, lockStatus, siteDbGroupId);

        // Assert
        Assert.False(result.IsSuccessful);
        await _repository.Received(1).GetAsync<Result>(Arg.Any<LockMatchCriteria>());
    }
} 