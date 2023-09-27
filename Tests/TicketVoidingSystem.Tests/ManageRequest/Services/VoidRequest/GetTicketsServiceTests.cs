using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest;

public class GetTicketsServiceTests
{
    private readonly GetTransInfoService getTransInfoService;
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;

    private readonly GetTicketsServiceImp service;

    public GetTicketsServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        mapper = Substitute.For<IMapper>();
        getTransInfoService = Substitute.For<GetTransInfoService>();
        service = new GetTicketsServiceImp(mapper, repository, getTransInfoService);
    }

    [Theory]
    [InlineData(IssueTypeConstant.EarlyKickOffTime, 1)]
    [InlineData(IssueTypeConstant.WrongKickOffTime, 1)]
    [InlineData(IssueTypeConstant.ArchivedTicket, 1)]
    [InlineData(IssueTypeConstant.AbnormalAccount, 1)]
    [InlineData(1, 0)]
    [InlineData(1, 1)]
    public async Task GetTickets_HasRequestIdNot0_HasCreateGetTicketInRequestCriteria(int issueTypeId, int matchId)
    {
        // Arrange
        var query = new GetTicketsQuery
            { IssueTypeId = issueTypeId, RequestId = 2, Match = new Match { MatchId = matchId } };
        var tickets = new List<BetId> { new(), new() };
        var ticketModels = new List<GetTicketModel> { new() { IsMixParlay = true } };
        repository.FetchMultipleAsync<BetId, BetId, BetId>(Arg.Any<GetTicketInRequestCriteria>())
            .ReturnsForAnyArgs((tickets, tickets, tickets));
        getTransInfoService.GetTransInfoJsonForVoid(Arg.Any<List<BetId>>(), Arg.Any<List<BetId>>(),
                Arg.Any<List<BetId>>(), default)
            .ReturnsForAnyArgs(new List<string> { "1" });
        mapper.Map<GetTicketsCriteria>(Arg.Any<GetTicketsQuery>()).Returns(new GetTicketsCriteria());
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>()).Returns(ticketModels);
        getTransInfoService.GetTransInfoJsonForVoid14(Arg.Any<List<BetId>>()).Returns(new List<string> { "2" });
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>()).Returns(ticketModels);
        mapper.Map<GetBetTrans14TicketsCriteria>(Arg.Any<GetTicketsQuery>())
            .Returns(new GetBetTrans14TicketsCriteria());
        // Act
        var result = service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        await repository.Received().FetchMultipleAsync<BetId, BetId, BetId>(Arg.Any<GetTicketInRequestCriteria>());
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
        getTransInfoService.GetTransInfoJsonForVoid(Arg.Any<List<BetId>>(), Arg.Any<List<BetId>>(),
                Arg.Any<List<BetId>>(), default)
            .ReturnsForAnyArgs(new List<string> { "1" });
        mapper.Map<GetTicketsCriteria>(Arg.Any<GetTicketsQuery>()).Returns(new GetTicketsCriteria());
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>()).Returns(ticketModels);
        getTransInfoService.GetTransInfoJsonForVoid14(Arg.Any<List<BetId>>()).Returns(new List<string> { "1" });
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
        getTransInfoService.GetTransInfoJsonForVoid(Arg.Any<List<BetId>>(), Arg.Any<List<BetId>>(),
                Arg.Any<List<BetId>>(), default)
            .ReturnsForAnyArgs(new List<string> { "1" });
        mapper.Map<GetTicketsCriteria>(Arg.Any<GetTicketsQuery>()).Returns(new GetTicketsCriteria());
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>()).Returns(ticketModels);
        getTransInfoService.GetTransInfoJsonForVoid14(Arg.Any<List<BetId>>()).Returns(new List<string> { "1" });
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>()).Returns(ticketModels);

        // Act
        var result = service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        await repository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>());
    }
}