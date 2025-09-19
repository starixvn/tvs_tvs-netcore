using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.OnlineServerRepository;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest.InsertQueue;

public class RepositoryServiceImpTests
{
    private readonly IDynamicRepository dynamicRepository;
    private readonly OnlineServerRepository onlineServerRepository;
    private readonly SessionService sessionService;
    private readonly MapTicketsService mapTicketsService;
    private readonly RepositoryServiceImp service;

    public RepositoryServiceImpTests()
    {
        dynamicRepository = Substitute.For<IDynamicRepository>();
        onlineServerRepository = Substitute.For<OnlineServerRepository>();
        sessionService = Substitute.For<SessionService>();
        mapTicketsService = Substitute.For<MapTicketsService>();

        service = new RepositoryServiceImp(
            dynamicRepository,
            onlineServerRepository,
            sessionService,
            mapTicketsService);
    }

    [Fact]
    public async Task GetServerInsertQueue_ShouldReturnMatchingServerIds()
    {
        // Arrange
        var tickets = new List<RequestDetailTicketModel>
        {
            new() { SiteDbGroupId = 1 },
            new() { SiteDbGroupId = 2 }
        };

        onlineServerRepository.GetOnlineServerIdsModel()
            .Returns(Task.FromResult<IEnumerable<SiteDbGroupModel>>(new[]
            {
                new SiteDbGroupModel { Id = 1 },
                new SiteDbGroupModel { Id = 3 }
            }));

        // Act
        var result = await service.GetServerInsertQueue(tickets);

        // Assert
        Assert.Single(result);
        Assert.Equal(1, result.First());
    }

    [Fact]
    public async Task InsertQueueBySiteDb_ShouldCallDynamicRepositoryWithCorrectCriteria()
    {
        // Arrange
        var tickets = new List<RequestDetailTicketModel>
        {
            new() { SiteDbGroupId = 1 }
        };

        sessionService.UserId.Returns(1);
        sessionService.GetClientIp().Returns("127.0.0.1");

        // Act
        await service.InsertQueueBySiteDb(1, 10, 100, tickets);

        // Assert
        await dynamicRepository.Received(1).ExecuteAsync(
            Arg.Is<InsertTicketVoidingQueueCriteria>(c =>
                c.SiteDbGroupId == 1 &&
                c.RequestId == 100 &&
                c.VoidingHistoryId == 10 &&
                c.UserId == 1 &&
                c.IP == "127.0.0.1"));
    }

    [Fact]
    public async Task UpdateIsProcessed_ShouldCallDynamicRepositoryWithMappedTickets()
    {
        // Arrange
        var query = new InsertQueueQuery
        {
            RequestId = 100,
            IssueTypeId = 5,
            SingleTickets = new List<BetId> { new() },
            ParlayTickets = new List<BetId> { new() },
            CricketTickets = new List<BetId> { new() },
            CancelCashOutTickets = new List<BetId> { new() }
        };
        var model = new List<RequestDetailTicketModel> { new() };

        mapTicketsService.MapBetIdToRequestDetailTicket(Arg.Any<IEnumerable<BetId>>(), 100, 5)
            .ReturnsForAnyArgs(model);

        // Act
        await service.UpdateIsProcessed(query);

        // Assert
        var ticketsJson = JsonSerializer.Serialize(model);
        await dynamicRepository.Received(1).ExecuteAsync(
            Arg.Is<UpdateIsProcessedForRequestTicketsCriteria>(c =>
                c.SingleTicketsJson == ticketsJson &&
                c.ParlayTicketsJson == ticketsJson &&
                c.CricketTicketsJson == ticketsJson &&
                c.CancelCashOutTicketsJson == ticketsJson));
    }
}