using System.Collections.Generic;
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
        var tickets = new List<BetId> { new(), new() };
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
}