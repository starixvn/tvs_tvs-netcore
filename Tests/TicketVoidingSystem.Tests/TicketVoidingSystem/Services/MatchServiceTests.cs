using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services;

public class MatchServiceTests
{
    private readonly RemotingRefWrapperService remotingRefWrapperService;
    private readonly IDynamicRepository repository;
    private readonly MatchServiceImp service;

    public MatchServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
        service = new MatchServiceImp(repository, remotingRefWrapperService);
    }

    [Fact]
    public void GetMatch_HasRequestIsGetMatchInfoCriteria_RepositoryHasGetAsync()
    {
        // Arrange
        var query = new GetMatchInfoCriteria();
        repository.GetAsync<Match>(Arg.Any<GetMatchInfoCriteria>()).Returns(new Match());
        // Act
        _ = service.GetMatch(query);

        // Assert
        repository.Received(1).GetAsync<Match>(Arg.Any<GetMatchInfoCriteria>());
    }

    [Fact]
    public void GetMatchVoidByCurrency_RepositoryHasGetAsync()
    {
        // Arrange
        // Act
        _ = service.GetMatchVoidByCurrency(new GetMatchInfoVoidByCurrencyCriteria());

        // Assert
        repository.Received(1).GetAsync<Match>(Arg.Any<GetMatchInfoVoidByCurrencyCriteria>());
    }

    [Fact]
    public void GetMatchVoidByCurrency_HasInputIsGetMatchId_RepositoryHasGetAsync()
    {
        // Arrange
        // Act
        _ = service.GetMatchVoidByCurrency(1);

        // Assert
        repository.Received(1).GetAsync<Match>(Arg.Any<GetMatchInfoVoidByCurrencyCriteria>());
    }

    [Fact]
    public void GetMatch_HasRequestIsId_RepositoryHasGetAsync()
    {
        // Arrange
        var query = 1;
        repository.GetAsync<Match>(Arg.Any<GetMatchInfoCriteria>()).Returns(new Match());
        // Act
        _ = service.GetMatch(query);

        // Assert
        repository.Received(1).GetAsync<Match>(Arg.Any<GetMatchInfoCriteria>());
    }

    [Fact]
    public void GetMatchVoidByCurrency_HasRequestIsCriteria_RepositoryHasGetAsync()
    {
        // Arrange
        var query = new GetMatchInfoVoidByCurrencyCriteria();

        // Act
        _ = service.GetMatchVoidByCurrency(query);

        // Assert
        repository.Received(1).GetAsync<Match>(Arg.Any<GetMatchInfoVoidByCurrencyCriteria>());
    }

    [Fact]
    public void GetMatchVoidByCurrency_HasMatchId_CalledExpected()
    {
        // Arrange
        // Act
        _ = service.GetMatchVoidByCurrency(1);

        // Assert
        repository.Received(1).GetAsync<Match>(Arg.Any<GetMatchInfoVoidByCurrencyCriteria>());
    }

    [Fact]
    public void UpdateMatchInfoFromRemotingRef_HasMatchIsNull_ReturnNull()
    {
        // Arrange

        // Act
        var actual = service.UpdateMatchInfoFromRemotingRef(null);

        // Assert
        Assert.Null(actual);
    }

    [Fact]
    public async Task GetMatchAddRequest_ReturnExpected()
    {
        // Arrange
        var criteria = new GetMatchInfoAddRequestCriteria { ErrorCode = 0, ErrorMsg = "" };
        var match = new Match();
        repository.GetAsync<Match>(criteria).ReturnsForAnyArgs(match);
        var expected = new MatchInfoAddRequestViewModel
        {
            Match = match,
            ErrorCode = criteria.ErrorCode,
            ErrorMsg = criteria.ErrorMsg
        };

        // Act
        var actual = await service.GetMatchAddRequest(criteria);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public void UpdateMatchInfoFromRemotingRef_HasMatchNotNull_ReturnMatchUpdated()
    {
        // Arrange
        var query = new Match();
        remotingRefWrapperService.GetTeamName(default, default, default).ReturnsForAnyArgs("TeamName");
        remotingRefWrapperService.GetLeagueName(default, default, default).ReturnsForAnyArgs("LeagueName");
        remotingRefWrapperService.GetSportName(default, default).ReturnsForAnyArgs("SportName");

        var expected = new Match
        {
            HomeName = "TeamName",
            HomeNameSimplified = "TeamName",
            HomeNameNewSimplified = "TeamName",
            HomeNameTraditional = "TeamName",
            AwayName = "TeamName",
            AwayNameSimplified = "TeamName",
            AwayNameNewSimplified = "TeamName",
            AwayNameTraditional = "TeamName",
            LeagueName = "LeagueName",
            LeagueNameSimplified = "LeagueName",
            LeagueNameNewSimplified = "LeagueName",
            LeagueNameTraditional = "LeagueName",
            SportTypeName = "SportName",
            SportTypeNameSimplified = "SportName",
            SportTypeNameNewSimplified = "SportName",
            SportTypeNameTraditional = "SportName",
            MatchEvent = "TeamName - vs - TeamName",
            MatchEventSimplified = "TeamName - vs - TeamName",
            MatchEventNewSimplified = "TeamName - vs - TeamName",
            Name = "0 - TeamName - vs - TeamName"
        };
        // Act
        var actual = service.UpdateMatchInfoFromRemotingRef(query);

        // Assert
        AssertExtension.Equal(expected.HomeName, actual.HomeName);
        AssertExtension.Equal(expected.AwayName, actual.AwayName);
        AssertExtension.Equal(expected.MatchEvent, actual.MatchEvent);
    }

    [Fact]
    public void UpdateMatchInfoFromRemotingRef_MatchHasIsOutrightAndIsOutrightIsTrue_ReturnMatchUpdated()
    {
        // Arrange
        var query = new Match { IsOutright = true, IsNeutral = true };
        remotingRefWrapperService.GetTeamName(1, default, default).ReturnsForAnyArgs("TeamName");
        remotingRefWrapperService.GetLeagueName(1, default, default).ReturnsForAnyArgs("LeagueName");
        remotingRefWrapperService.GetSportName(default, default).ReturnsForAnyArgs("SportName");

        var expected = new Match
        {
            IsOutright = true,
            IsNeutral = true,
            HomeName = "TeamName" + " (N)",
            HomeNameSimplified = "TeamName" + " (中)",
            HomeNameNewSimplified = "TeamName" + " (中)",
            HomeNameTraditional = "TeamName" + " (中)",
            AwayName = "TeamName",
            AwayNameSimplified = "TeamName",
            AwayNameNewSimplified = "TeamName",
            AwayNameTraditional = "TeamName",
            LeagueName = "LeagueName",
            LeagueNameSimplified = "LeagueName",
            LeagueNameNewSimplified = "LeagueName",
            LeagueNameTraditional = "LeagueName",
            SportTypeName = "SportName",
            SportTypeNameSimplified = "SportName",
            SportTypeNameNewSimplified = "SportName",
            SportTypeNameTraditional = "SportName",
            MatchEvent = "TeamName (N) - LeagueName",
            MatchEventSimplified = "TeamName (中) - LeagueName",
            MatchEventNewSimplified = "TeamName (中) - LeagueName",
            Name = "0 - TeamName (N) - LeagueName"
        };
        // Act
        var actual = service.UpdateMatchInfoFromRemotingRef(query);

        // Assert
        AssertExtension.Equal(expected.HomeName, actual.HomeName);
        AssertExtension.Equal(expected.AwayName, actual.AwayName);
        AssertExtension.Equal(expected.MatchEvent, actual.MatchEvent);
    }

    [Theory]
    [InlineData(160, "Lucky 3 Game No.", "", "")]
    [InlineData(161, "Number Game No. ", "", "")]
    [InlineData(164, "Happy 5 No .", "TeamName - vs - TeamName", "TeamName - vs - TeamName")]
    [InlineData(207, "BFName - vs - BFName", "", "")]
    public void UpdateMatchInfoFromRemotingRef_MatchHasSportType_MatchUpdatedMatchEvent(int sportType, string matchEvent
        , string matchEventSimplified, string matchEventNewSimplified)
    {
        // Arrange
        var query = new Match { SportType = sportType };
        remotingRefWrapperService.GetTeamName(1, default, default).ReturnsForAnyArgs("TeamName");
        remotingRefWrapperService.GetLeagueName(1, default, default).ReturnsForAnyArgs("LeagueName");
        remotingRefWrapperService.GetSportName(default, default).ReturnsForAnyArgs("SportName");
        remotingRefWrapperService.GetBFName(default).ReturnsForAnyArgs("BFName");
        // Act
        var actual = service.UpdateMatchInfoFromRemotingRef(query);

        // Assert
        AssertExtension.Equal(matchEvent, actual.MatchEvent);
        AssertExtension.Equal(matchEventSimplified, actual.MatchEventSimplified);
        AssertExtension.Equal(matchEventNewSimplified, actual.MatchEventNewSimplified);
    }
}