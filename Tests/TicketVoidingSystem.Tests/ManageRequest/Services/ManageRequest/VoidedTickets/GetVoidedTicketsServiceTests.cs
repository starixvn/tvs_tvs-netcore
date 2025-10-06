using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.OnlineServerRepository;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.VoidedTickets;

public class GetVoidedTicketsServiceTests : IClassFixture<AppSettingFixture>, IClassFixture<RemotingRefFixture>
{
    private readonly IMapper mapper = Substitute.For<IMapper>();
    private readonly IDynamicRepository repository = Substitute.For<IDynamicRepository>();
    private readonly OnlineServerRepository onlineServerRepository = Substitute.For<OnlineServerRepository>();
    private readonly GetVoidedTicketsServiceImp service;

    public GetVoidedTicketsServiceTests()
    {
        service = new GetVoidedTicketsServiceImp(repository, onlineServerRepository, mapper);
    }

    [Fact]
    public async Task GetTickets_HasIssueTypeIsRecoverTicket_GetRecoveredTickets()
    {
        // Arrange
        var tickets = new List<VoidedTicketModel> { new() { GroupName = "Credit" } };
        var query = new GetVoidedTicketsQuery { IssueTypeId = IssueTypeConstant.RecoverTicket, IsCreditOnly = true };
        mapper.Map<GetRecoveredTicketsCriteria>(Arg.Any<GetVoidedTicketsQuery>()).ReturnsForAnyArgs(new GetRecoveredTicketsCriteria());
        repository.FetchAsync<VoidedTicketModel>(Arg.Any<GetRecoveredTicketsCriteria>()).ReturnsForAnyArgs(tickets);

        // Act
        _ = await service.GetTickets(query);

        // Assert
        await repository.Received().FetchAsync<VoidedTicketModel>(Arg.Any<GetRecoveredTicketsCriteria>());
    }

    [Fact]
    public async Task GetTickets_HasIssueTypeIsArchivedTicket_GetVoidedTickets14()
    {
        // Arrange
        var query = new GetVoidedTicketsQuery
        {
            IssueTypeId = 17
        };
        mapper.Map<GetVoidedTickets14Criteria>(Arg.Any<GetVoidedTicketsQuery>())
            .Returns(new GetVoidedTickets14Criteria());
        onlineServerRepository.FetchAsync<VoidedTicketModel>(Arg.Any<GetVoidedTickets14Criteria>())
            .ReturnsForAnyArgs(new List<VoidedTicketModel>
        {
            new()
            {
                TransId = 1
            }
        });

        // Act
        var result = await service.GetTickets(query);

        // Assert

        Assert.NotNull(result);
        Assert.Equal(1, result.Count());
    }

    [Fact]
    public async Task GetTickets_InputIsCreditOnlyTrue_ReturnVoidedTicketModel()
    {
        // Arrange
        var query = new GetVoidedTicketsQuery
        {
            IsCreditOnly = true
        };
        mapper.Map<GetVoidedTicketsCriteria>(Arg.Any<GetVoidedTicketsQuery>()).Returns(new GetVoidedTicketsCriteria());
        onlineServerRepository.FetchAsync<VoidedTicketModel>(Arg.Any<GetVoidedTicketsCriteria>())
            .ReturnsForAnyArgs(new List<VoidedTicketModel>
        {
            new()
            {
                GroupName = "Credit",
                TransId = 1
            }
        });

        // Act
        var result = await service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Count());
    }

    [Fact]
    public async Task GetMatchInfo_InputMatchId_ReturnVoidedTicketModel()
    {
        // Arrange

        repository.GetAsync<Match>(Arg.Any<GetVoidedTicketsCriteria>()).ReturnsForAnyArgs(new Match
        {
            MatchId = 123
        });

        // Act
        var result = await service.GetMatchInfo(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(123, result.MatchId);
    }
}