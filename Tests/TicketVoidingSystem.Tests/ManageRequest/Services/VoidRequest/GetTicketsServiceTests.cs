using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest;

public class GetTicketsServiceTests
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;

    private readonly GetTicketsServiceImp service;

    public GetTicketsServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        mapper = Substitute.For<IMapper>();
        service = new GetTicketsServiceImp(mapper, repository);
    }

    [Theory]
    [InlineData(IssueTypeConstant.EarlyKickOffTime)]
    [InlineData(IssueTypeConstant.WrongKickOffTime)]
    public async Task GetTickets_HasRequestIdNot0_HasCreateGetTicketInRequestCriteria(int issueTypeId)
    {
        // Arrange
        var query = new GetTicketsQuery
        { IssueTypeId = issueTypeId, RequestId = 2, Match = new Match { MatchId = 1 } };
        var ticketModels = new List<GetTicketModel> { new() { IsMixParlay = true } };
        mapper.Map<GetTicketsCriteria>(default).ReturnsForAnyArgs(new GetTicketsCriteria());
        repository.FetchAsync<GetTicketModel>(default).ReturnsForAnyArgs(ticketModels);

        // Act
        var result = service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        await repository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>());
    }

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    public async Task GetTickets_HasRequestIdIs0_HasGetBetTransTicket(int matchId)
    {
        // Arrange
        var query = new GetTicketsQuery { IssueTypeId = 8, RequestId = 0, Match = new Match { MatchId = matchId } };
        var tickets = new List<BetId> { new(), new() };
        var ticketModels = new List<GetTicketModel> { new() { IsMixParlay = true } };
        repository.FetchMultipleAsync<BetId, BetId, BetId>(Arg.Any<GetTicketInRequestCriteria>())
            .ReturnsForAnyArgs((tickets, tickets, tickets));
        mapper.Map<GetTicketsCriteria>(Arg.Any<GetTicketsQuery>()).Returns(new GetTicketsCriteria());
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>()).Returns(ticketModels);
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>()).Returns(ticketModels);

        // Act
        var result = service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        await repository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>());
    }

    [Fact]
    public async Task GetTickets_HasMatchIssNull_HasGetBetTransTicket()
    {
        // Arrange
        var query = new GetTicketsQuery { IssueTypeId = 1, RequestId = 0, Match = null };
        var tickets = new List<BetId> { new(), new() };
        var ticketModels = new List<GetTicketModel> { new() { IsMixParlay = true } };
        repository.FetchMultipleAsync<BetId, BetId, BetId>(Arg.Any<GetTicketInRequestCriteria>())
            .ReturnsForAnyArgs((tickets, tickets, tickets));
        mapper.Map<GetTicketsCriteria>(Arg.Any<GetTicketsQuery>()).Returns(new GetTicketsCriteria());
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>()).Returns(ticketModels);
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>()).Returns(ticketModels);

        // Act
        var result = service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        await repository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>());
    }

    [Fact]
    public async Task GetTickets_WithArchivedTicket_ShouldCallGetBetTrans14Ticket()
    {
        // Arrange
        var query = new GetTicketsQuery
        {
            IssueTypeId = IssueTypeConstant.ArchivedTicket,
            RequestId = 0,
            Match = new Match { MatchId = 1 }
        };
        var ticketModels = new List<GetTicketModel>
        {
            new() { IsMixParlay = true, GroupId = 1, TransId = 1 },
            new() { IsMixParlay = false, GroupId = 2, TransId = 1 }
        };
        mapper.Map<GetBetTrans14TicketsCriteria>(Arg.Any<GetTicketsQuery>()).Returns(new GetBetTrans14TicketsCriteria());
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>()).Returns(ticketModels);

        // Act
        var result = await service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        await repository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>());
        Assert.Equal(8, result.Count());
        Assert.Equal(1, result.First().GroupId);
    }

    [Theory]
    [InlineData(IssueTypeConstant.AbnormalAccount)]
    [InlineData(IssueTypeConstant.AbnormalBet)]
    public async Task GetTickets_WithAbnormalTypes_ShouldCallBothGetTicketsMethods(int issueTypeId)
    {
        // Arrange
        var query = new GetTicketsQuery
        {
            IssueTypeId = issueTypeId,
            RequestId = 0,
            Match = new Match { MatchId = 1 }
        };
        var betTrans14Tickets = new List<GetTicketModel>
        {
            new() { IsMixParlay = true, GroupId = 1, TransId = 1 }
        };
        var betTransTickets = new List<GetTicketModel>
        {
            new() { IsMixParlay = false, GroupId = 2, TransId = 1 }
        };

        mapper.Map<GetBetTrans14TicketsCriteria>(Arg.Any<GetTicketsQuery>()).Returns(new GetBetTrans14TicketsCriteria());
        mapper.Map<GetTicketsCriteria>(Arg.Any<GetTicketsQuery>()).Returns(new GetTicketsCriteria());
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>()).Returns(betTrans14Tickets);
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>()).Returns(betTransTickets);

        // Act
        var result = await service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        await repository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>());
        await repository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>());
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetTickets_ShouldOrderByGroupIdAndTransId()
    {
        // Arrange
        var query = new GetTicketsQuery
        {
            IssueTypeId = IssueTypeConstant.ArchivedTicket,
            RequestId = 0,
            Match = new Match { MatchId = 1 }
        };
        var ticketModels = new List<GetTicketModel>
        {
            new() { IsMixParlay = true, GroupId = 2, TransId = 2 },
            new() { IsMixParlay = false, GroupId = 1, TransId = 3 },
            new() { IsMixParlay = true, GroupId = 1, TransId = 1 }
        };
        mapper.Map<GetBetTrans14TicketsCriteria>(Arg.Any<GetTicketsQuery>()).Returns(new GetBetTrans14TicketsCriteria());
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>()).Returns(ticketModels);

        // Act
        var result = await service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        var resultList = result.ToList();
        Assert.Equal(1, resultList[0].GroupId);
        Assert.Equal(1, resultList[0].TransId);
        Assert.Equal(1, resultList[1].GroupId);
        Assert.Equal(1, resultList[1].TransId);
        Assert.Equal(1, resultList[2].GroupId);
        Assert.Equal(1, resultList[2].TransId);
    }
}