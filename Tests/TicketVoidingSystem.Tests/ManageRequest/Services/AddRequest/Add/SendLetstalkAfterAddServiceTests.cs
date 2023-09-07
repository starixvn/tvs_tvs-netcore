using System;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Letstalk;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.Add;

public class SendLetstalkAfterAddServiceTests
{
    private readonly MatchService matchService;
    private readonly NotificationLetstalkService notificationLetstalkService;
    private readonly SendLetstalkAfterAddServiceImp service;

    public SendLetstalkAfterAddServiceTests()
    {
        var sessionService = Substitute.For<SessionService>();
        matchService = Substitute.For<MatchService>();
        notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        service = new SendLetstalkAfterAddServiceImp(sessionService,
            matchService, notificationLetstalkService);
    }

    [Theory]
    [InlineData(1, 1, 31)]
    [InlineData(2, null, 38)]
    public void Execute_Successful_CalledExpected(int filterBy, int matchId, int subIssueTypeId)
    {
        // Arrange
        var query = new AddRequestQuery
        {
            MatchId = matchId, FilterBy = filterBy, IsHasUusTickets = false,
            IssueTypeId = IssueTypeConstant.AbnormalBet, SubIssueTypeId = subIssueTypeId
        };
        var match = new Match
        {
            EventDate = DateTime.Now,
            LeagueName = "",
            MatchEvent = "",
            GlobalShowTime = DateTime.Now
        };
        matchService.GetMatch(Arg.Any<int>()).ReturnsForAnyArgs(match);
        matchService.UpdateMatchInfoFromRemotingRef(Arg.Any<Match>()).ReturnsForAnyArgs(match);

        // Act
        _ = service.Execute(query, 1223);

        // Assert
        notificationLetstalkService.Received(1)
            .SendToGroupAbnormalBetRequest(Arg.Any<string>(), Arg.Any<string>(), null);
        matchService.Received(1).GetMatch(matchId);
        matchService.Received(1).UpdateMatchInfoFromRemotingRef(Arg.Any<Match>());
    }

    [Fact]
    public void Execute_InValidQuery_NotCalledExpected()
    {
        // Arrange
        var query = new AddRequestQuery();

        // Act
        _ = service.Execute(query, 1223);

        // Assert
        notificationLetstalkService.Received(0)
            .SendToGroupAbnormalBetRequest(Arg.Any<string>(), Arg.Any<string>(), null);
        matchService.Received(0).GetMatch(Arg.Any<int>());
        matchService.Received(0).UpdateMatchInfoFromRemotingRef(Arg.Any<Match>());
    }
}