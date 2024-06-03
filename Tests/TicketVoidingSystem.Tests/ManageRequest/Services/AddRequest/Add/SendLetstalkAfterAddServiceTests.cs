using System;
using System.Collections.Generic;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.ViewModels;
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
    [InlineData(1, 31)]
    [InlineData(2, 38)]
    [InlineData(3, 31)]
    public void Execute_Successful_CalledExpected(int filterBy, int subIssueTypeId)
    {
        // Arrange
        var model = new AbnormalBetViewModel
        {
            FilterBy = filterBy,
            Matches = new List<MatchInfoAddRequest> { new() { MatchId = 1 } },
            SubIssueTypeId = subIssueTypeId,
            SendLetstalkModels = new List<SendLetstalkModel>
            {
                new (){ IsHasUusTickets = false, MatchId = 1 },
                new (){ IsHasUusTickets = true, MatchId = 1 }
            }
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
        _ = service.Execute(model, 1223);

        // Assert
        notificationLetstalkService.Received(1)
            .SendToGroupAbnormalBetRequest(Arg.Any<string>(), Arg.Any<string>(), null);
    }

    [Fact]
    public void Execute_InValidQuery_NotCalledExpected()
    {
        // Arrange

        // Act
        _ = service.Execute(new AbnormalBetViewModel(), 1223);

        // Assert
        notificationLetstalkService.Received(0)
            .SendToGroupAbnormalBetRequest(Arg.Any<string>(), Arg.Any<string>(), null);
        matchService.Received(0).GetMatch(Arg.Any<int>());
        matchService.Received(0).UpdateMatchInfoFromRemotingRef(Arg.Any<Match>());
    }
}