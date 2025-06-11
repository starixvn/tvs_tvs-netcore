using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using AutoMapper;
using NSubstitute;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.VoidTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Letstalk;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Services.VoidTickets;

[Category("VoidByBetId")]
public class LetstalkServiceTest
{
    private readonly IMapper _mapper;
    private readonly MatchService _matchService;
    private readonly NotificationLetstalkService _notificationLetstalkService;
    private readonly LetstalkServiceImp _service;

    public LetstalkServiceTest()
    {
        _mapper = Substitute.For<IMapper>();
        _matchService = Substitute.For<MatchService>();
        _notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        _service = new LetstalkServiceImp(_mapper, _matchService, _notificationLetstalkService);
    }

    [Fact]
    public async Task Send_WithMatchNotNull_ShouldSendToGroupVoidSettledBets()
    {
        // Arrange
        var query = new VoidTicketsQuery { Match = new Match() };
        var model = new VoidTicketsModel { Tickets = new List<TicketEmailModel>() };
        var infoForLetstalk = new TicketInfoForLetstalk();
        var expectedResults = new List<Result>();

        _mapper.Map<TicketInfoForLetstalk>(query).Returns(infoForLetstalk);
        _notificationLetstalkService.SendToGroupVoidSettledBets(infoForLetstalk, model.Tickets)
            .Returns(expectedResults);

        // Act
        var results = await _service.Send(query, model);

        // Assert
        Assert.Equal(expectedResults, results);
        await _notificationLetstalkService.Received(1)
            .SendToGroupVoidSettledBets(infoForLetstalk, model.Tickets);
    }

    [Fact]
    public async Task Send_WithMatchNull_ShouldSendLetstalkWithMultiMessage()
    {
        // Arrange
        var query = new VoidTicketsQuery { Match = null };
        var model = new VoidTicketsModel
        {
            Tickets = new List<TicketEmailModel>
            {
                new() { BetTypeId = BetTypeConstant.Handicap, ParentMatchId = 1 },
                new() { BetTypeId = 1231, OddsId = 2 }
            }
        };
        var infoForLetstalk = new TicketInfoForLetstalk();
        var expectedResults = new List<Result>();

        _mapper.Map<TicketInfoForLetstalk>(query).Returns(infoForLetstalk);
        _notificationLetstalkService.SendToGroupVoidSettledBets(Arg.Any<TicketInfoForLetstalk>(), Arg.Any<IEnumerable<TicketEmailModel>>())
            .Returns(expectedResults);
        _matchService.GetMatch(Arg.Any<GetMatchInfoCriteria>()).Returns(new Match());
        _matchService.UpdateMatchInfoFromRemotingRef(Arg.Any<Match>()).Returns(new Match());

        // Act
        var results = await _service.Send(query, model);

        // Assert
        Assert.Equal(expectedResults, results);
        await _notificationLetstalkService.Received(2)
            .SendToGroupVoidSettledBets(Arg.Any<TicketInfoForLetstalk>(), Arg.Any<IEnumerable<TicketEmailModel>>());
    }

    [Fact]
    public async Task Send_WithParlayTickets_ShouldNotSendLetstalk()
    {
        // Arrange
        var query = new VoidTicketsQuery { Match = null };
        var model = new VoidTicketsModel
        {
            Tickets = new List<TicketEmailModel>
            {
                new() { BetTypeId = BetTypeConstant.SystemParlay }
            }
        };
        var infoForLetstalk = new TicketInfoForLetstalk();

        _mapper.Map<TicketInfoForLetstalk>(query).Returns(infoForLetstalk);

        // Act
        var results = await _service.Send(query, model);

        // Assert
        Assert.Empty(results);
        await _notificationLetstalkService.DidNotReceive()
            .SendToGroupVoidSettledBets(Arg.Any<TicketInfoForLetstalk>(), Arg.Any<IEnumerable<TicketEmailModel>>());
    }

    [Fact]
    public async Task Send_WithVirtualSportsTickets_ShouldSendToVirtualSportsGroup()
    {
        // Arrange
        var query = new VoidTicketsQuery { Match = null };
        var model = new VoidTicketsModel
        {
            Tickets = new List<TicketEmailModel>
            {
                new() { BetTypeId = 1231, OddsId = 1 }
            }
        };
        var infoForLetstalk = new TicketInfoForLetstalk();
        var expectedResults = new List<Result>();

        _mapper.Map<TicketInfoForLetstalk>(query).Returns(infoForLetstalk);
        _notificationLetstalkService.SendToGroupVoidSettledBets(Arg.Any<TicketInfoForLetstalk>(), Arg.Any<IEnumerable<TicketEmailModel>>())
            .Returns(expectedResults);
        _matchService.GetMatch(Arg.Any<GetMatchInfoCriteria>()).Returns(new Match());
        _matchService.UpdateMatchInfoFromRemotingRef(Arg.Any<Match>()).Returns(new Match());

        // Act
        var results = await _service.Send(query, model);

        // Assert
        Assert.Equal(expectedResults, results);
        await _notificationLetstalkService.Received(1)
            .SendToGroupVoidSettledBets(Arg.Is<TicketInfoForLetstalk>(x => x.Match != null), Arg.Any<IEnumerable<TicketEmailModel>>());
    }
}