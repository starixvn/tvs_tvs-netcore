using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.OnlineServerRepository;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest;

public class GetTicketsServiceTests
{
    private readonly IMapper mapper = Substitute.For<IMapper>();
    private readonly OnlineServerRepository onlineServerRepository = Substitute.For<OnlineServerRepository>();
    private readonly GetTicketsServiceImp service;

    public GetTicketsServiceTests()
    {
        service = new GetTicketsServiceImp(mapper, onlineServerRepository);
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
        mapper.Map<GetTicketsCriteria>(null).ReturnsForAnyArgs(new GetTicketsCriteria());
        onlineServerRepository.FetchAsync<GetTicketModel>(null).ReturnsForAnyArgs(ticketModels);

        // Act
        var result = service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        await onlineServerRepository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>());
    }

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    public async Task GetTickets_HasRequestIdIs0_HasGetBetTransTicket(int matchId)
    {
        // Arrange
        var query = new GetTicketsQuery { IssueTypeId = 8, RequestId = 0, Match = new Match { MatchId = matchId } };
        var ticketModels = new List<GetTicketModel> { new() { IsMixParlay = true } };
        mapper.Map<GetTicketsCriteria>(Arg.Any<GetTicketsQuery>()).Returns(new GetTicketsCriteria());
        onlineServerRepository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>()).Returns(ticketModels);
        onlineServerRepository.FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>()).Returns(ticketModels);

        // Act
        var result = service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        await onlineServerRepository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>());
    }

    [Fact]
    public async Task GetTickets_HasMatchIssNull_HasGetBetTransTicket()
    {
        // Arrange
        var query = new GetTicketsQuery { IssueTypeId = 1, RequestId = 0, Match = null };
        var ticketModels = new List<GetTicketModel> { new() { IsMixParlay = true } };

        mapper.Map<GetTicketsCriteria>(Arg.Any<GetTicketsQuery>()).Returns(new GetTicketsCriteria());
        onlineServerRepository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>()).Returns(ticketModels);
        onlineServerRepository.FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>()).Returns(ticketModels);

        // Act
        var result = service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        await onlineServerRepository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>());
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
        onlineServerRepository.FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>()).Returns(ticketModels);

        // Act
        var result = await service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        await onlineServerRepository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>());
        Assert.Equal(2, result.Count());
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
        onlineServerRepository.FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>()).Returns(betTrans14Tickets);
        onlineServerRepository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>()).Returns(betTransTickets);

        // Act
        var result = await service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        await onlineServerRepository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>());
        await onlineServerRepository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>());
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
        onlineServerRepository.FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>()).Returns(ticketModels);

        // Act
        var result = await service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        var resultList = result.ToList();
        Assert.Equal(1, resultList[0].GroupId);
        Assert.Equal(1, resultList[0].TransId);
    }
}