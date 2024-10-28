using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.BetList.Core.Entities;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest;

public class CopyRequestInfoServiceTests
{
    public IDynamicRepository repository;
    public MatchService matchService;
    public BetListService betListService;
    public RequestExtraInfoXmlService requestExtraInfoXmlService;
    public CopyRequestInfoServiceImp service;

    [Fact]
    public async Task GetCopyInfo_ValidData_ReturnExpected()
    {
        // Arrange
        const int matchId = 8634527;
        const int requestId = 56473;
        var requestInfos = new List<RequestInfoForCopy> { new() { MatchId = 8634527, RequestId = "56473",
            OperatorInfo = "OperatorInfo", IssueTypeId = 1, RequestExtraInfo = "RequestExtraInfo" } };
        var betTypeTickets = new List<BetTypeTicketsInfo> { new() { TicketsCount = 2 } };
        var operators = new List<OperatorInfo> { new() { MatchId = 8634527 } };
        requestExtraInfoXmlService = Substitute.For<RequestExtraInfoXmlService>();
        repository = Substitute.For<IDynamicRepository>();
        requestExtraInfoXmlService.ParseXmlToOperators("OperatorInfo").Returns(operators);
        repository.FetchMultipleAsync<RequestInfoForCopy, BetTypeTicketsInfo>(Arg.Any<CopyRequestInfoCriteria>()).Returns((requestInfos, betTypeTickets));
        service = new CopyRequestInfoServiceImp(repository, null, null, requestExtraInfoXmlService);
        var requestInfoForCopyExpected = new RequestInfoForCopy()
        {
            MatchId = 8634527,
            RequestId = "56473",
            OperatorInfo = "OperatorInfo",
            IssueTypeId = 1,
            RequestExtraInfo = "RequestExtraInfo",
            Operators = operators,
            IsCheckedVar = false
        };

        // Act
        var actual = await service.GetCopyInfo(matchId, requestId);

        // Assert
        AssertExtension.Equal(requestInfoForCopyExpected, actual.Item1);
        AssertExtension.Equal(betTypeTickets, actual.Item2);
    }

    [Fact]
    public void UpdateMatchInfo_ValidData_CalledUpdateMatchInfo()
    {
        // Arrange
        const int matchId = 8634527;
        var requestInfo = new RequestInfoForCopy
        {
            HomeId = 1,
            AwayId = 2,
            LeagueId = 1,
            IsNeutral = true
        };

        matchService = Substitute.For<MatchService>();
        service = new CopyRequestInfoServiceImp(null, matchService, null, null);

        // Act
        service.UpdateMatchInfo(matchId, requestInfo);

        // Assert
        matchService.Received(1).UpdateMatchInfoFromRemotingRef(Arg.Any<Match>());
    }

    [Fact]
    public void UpdateBetTypeName_ValidData_CalledGetBetTypeName()
    {
        // Arrange
        var betTypeTickets = new List<BetTypeTicketsInfo> { new() { BetId = 11124, BetTypeId = 1 } };

        betListService = Substitute.For<BetListService>();
        betListService.GetBetTypeName(Arg.Any<Ticket>()).Returns("BetTypeName");
        service = new CopyRequestInfoServiceImp(null, null, betListService, null);

        // Act
        service.UpdateBetTypeName(betTypeTickets);

        // Assert
        Assert.Equal("BetTypeName", betTypeTickets[0].BetTypeName);
        betListService.Received(1).GetBetTypeName(Arg.Any<Ticket>());
    }

    [Fact]
    public async Task UpdatePlayerNameForBetTypeNextManOut_UpdatedPlayerName()
    {
        // Arrange
        const int matchId = 8634527;
        var betTypeTickets = new List<BetTypeTicketsInfo> { new() { BetId = 11124, BetTypeId = 1, PlayerAndOdds = "b$0" }, new() };
        var oddsInfo = new List<OddsInfoViewModel> { new() { OddsId = "0", BetChoice = "b", PlayerName = "a" } };
        repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<OddsInfoViewModel>(Arg.Any<GetOddsInfoCriteria>()).Returns(oddsInfo);
        service = new CopyRequestInfoServiceImp(repository, null, null, null);

        // Act
        await service.UpdatePlayerNameForBetTypeNextManOut(matchId, betTypeTickets);

        // Assert
        Assert.Equal("a - a", betTypeTickets[0].PlayerName);
    }
}