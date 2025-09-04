using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.OnlineServerRepository;
using Xunit;
using MapTicketsService = TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue.MapTicketsService;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest;

public class InsertQueueServiceTests
{
    private readonly InsertVoidingHistoryService insertVoidingHistoryService;
    private readonly IDynamicRepository repository;
    private readonly InsertQueueServiceImp service;
    private readonly SessionService sessionService;
    private readonly MapTicketsService mapTicketsService;
    private readonly ValidationTicketsService validationTicketsService;
    private readonly OnlineServerRepository onlineServerRepository;

    public InsertQueueServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        sessionService = Substitute.For<SessionService>();
        insertVoidingHistoryService = Substitute.For<InsertVoidingHistoryService>();
        mapTicketsService = Substitute.For<MapTicketsService>();
        validationTicketsService = Substitute.For<ValidationTicketsService>();
        onlineServerRepository = Substitute.For<OnlineServerRepository>();
        service = new InsertQueueServiceImp(repository, sessionService, mapTicketsService, validationTicketsService,
            insertVoidingHistoryService, onlineServerRepository);
    }

    [Theory]
    [InlineData(IssueTypeConstant.DangerAccepted)]
    [InlineData(IssueTypeConstant.RedCard)]
    [InlineData(IssueTypeConstant.WrongScore)]
    [InlineData(IssueTypeConstant.AbnormalAccount)]
    [InlineData(0)]
    public async Task InsertTicketVoidingQueue_ValidRequest_HasCreateInsertTicketVoidingQueueCriteria(int issueTypeId)
    {
        // Arrange
        var betId1 = new BetId { TransId = "123", SiteDbGroupId = 1, MatchId = 1 };
        var betId2 = new BetId { TransId = "123", SiteDbGroupId = 2 };
        var query = new InsertQueueQuery
        {
            SingleTickets = new List<BetId> { betId1, betId2 },
            ParlayTickets = new List<BetId> { betId1, betId1 },
            CancelCashOutTickets = new List<BetId> { betId1, betId2, betId2 },
            CricketTickets = new List<BetId> { betId1 },
            IssueTypeId = issueTypeId
        };
        var ticketsInsertQueue = new List<RequestDetailTicketModel> { new() };
        validationTicketsService.RecheckTicketsStatus(default).ReturnsForAnyArgs(ticketsInsertQueue);
        insertVoidingHistoryService.InsertVoidingHistory(Arg.Any<InsertQueueQuery>(), default, Arg.Any<string>(), Arg.Any<string>())
            .ReturnsForAnyArgs(1);
        sessionService.GetClientIp().ReturnsForAnyArgs("123");
        repository.ExecuteAsync(Arg.Any<InsertTicketVoidingQueueCriteria>()).Returns(1);
        repository.ExecuteAsync(Arg.Any<UpdateIsProcessedForRequestTicketsCriteria>()).Returns(1);
        onlineServerRepository.GetOnlineServerIdsModel().ReturnsForAnyArgs([new SiteDbGroupModel()]);

        // Act
        await service.InsertTicketVoidingQueue(query);

        // Assert
        await repository.Received().ExecuteAsync(Arg.Any<InsertTicketVoidingQueueCriteria>());
    }

    [Fact]
    public async Task InsertTicketVoidingQueue_HasOnlySingleTickets_CalledExpected()
    {
        // Arrange
        var betId1 = new BetId { TransId = "123", SiteDbGroupId = 1, MatchId = 1 };
        var betId2 = new BetId { TransId = "123", SiteDbGroupId = 2, MatchId = null };

        var query = new InsertQueueQuery
        {
            SingleTickets = new List<BetId> { betId1, betId2 },
            ParlayTickets = new List<BetId>(),
            CancelCashOutTickets = new List<BetId>(),
            CricketTickets = new List<BetId>(),
            IssueTypeId = IssueTypeConstant.Wrong1stHDP,
            RequestId = 1
        };
        var ticketsInsertQueue = new List<RequestDetailTicketModel> { new() };
        validationTicketsService.RecheckTicketsStatus(default).ReturnsForAnyArgs(ticketsInsertQueue);
        insertVoidingHistoryService.InsertVoidingHistory(Arg.Any<InsertQueueQuery>(), default, Arg.Any<string>(), Arg.Any<string>()).ReturnsForAnyArgs(1);
        sessionService.GetClientIp().ReturnsForAnyArgs("123");
        repository.ExecuteAsync(Arg.Any<InsertTicketVoidingQueueCriteria>()).Returns(1);
        repository.ExecuteAsync(Arg.Any<UpdateIsProcessedForRequestTicketsCriteria>()).Returns(1);
        onlineServerRepository.GetOnlineServerIdsModel().ReturnsForAnyArgs([new SiteDbGroupModel()]);

        // Act
        await service.InsertTicketVoidingQueue(query);

        // Assert
        await repository.Received().ExecuteAsync(Arg.Any<InsertTicketVoidingQueueCriteria>());
    }

    [Fact]
    public async Task InsertTicketVoidingQueue_HasOnlyParlayTicketsTickets_CalledExpected()
    {
        // Arrange
        var betId1 = new BetId { TransId = "123", SiteDbGroupId = 1 };
        var betId2 = new BetId { TransId = "123", SiteDbGroupId = 2 };
        var query = new InsertQueueQuery
        {
            SingleTickets = new List<BetId>(),
            ParlayTickets = new List<BetId> { betId1, betId2 },
            CancelCashOutTickets = new List<BetId>(),
            CricketTickets = new List<BetId>(),
            IssueTypeId = IssueTypeConstant.Wrong1stHDP,
            RequestId = 1
        };
        var ticketsInsertQueue = new List<RequestDetailTicketModel> { new() };
        validationTicketsService.RecheckTicketsStatus(default).ReturnsForAnyArgs(ticketsInsertQueue);
        insertVoidingHistoryService.InsertVoidingHistory(Arg.Any<InsertQueueQuery>(), default, Arg.Any<string>(), Arg.Any<string>()).ReturnsForAnyArgs(1);
        sessionService.GetClientIp().ReturnsForAnyArgs("123");
        repository.ExecuteAsync(Arg.Any<InsertTicketVoidingQueueCriteria>()).Returns(1);
        repository.ExecuteAsync(Arg.Any<UpdateIsProcessedForRequestTicketsCriteria>()).Returns(1);
        onlineServerRepository.GetOnlineServerIdsModel().ReturnsForAnyArgs([new SiteDbGroupModel()]);

        // Act
        await service.InsertTicketVoidingQueue(query);

        // Assert
        await repository.Received().ExecuteAsync(Arg.Any<InsertTicketVoidingQueueCriteria>());
    }

    [Fact]
    public async Task UpdateIsProcessed_HasCreateUpdateIsProcessedForRequestTicketsCriteria()
    {
        // Arrange
        var betId1 = new BetId { TransId = "123", SiteDbGroupId = 1 };
        var betId2 = new BetId { TransId = "123", SiteDbGroupId = 2 };

        var query = new InsertQueueQuery
        {
            SingleTickets = new List<BetId> { betId1, betId2 },
            ParlayTickets = new List<BetId> { betId1, betId1 },
            CancelCashOutTickets = new List<BetId> { betId1, betId2, betId2 },
            CricketTickets = new List<BetId> { betId1 },
            IssueTypeId = 1,
            RequestId = 123
        };
        var requestDetailTicketModel = new List<RequestDetailTicketModel>();
        mapTicketsService.MapBetIdToRequestDetailTicket(Arg.Any<IEnumerable<BetId>>(), query.RequestId, query.IssueTypeId).ReturnsForAnyArgs(requestDetailTicketModel);
        repository.ExecuteAsync(Arg.Any<UpdateIsProcessedForRequestTicketsCriteria>()).Returns(1);

        // Act
        await service.UpdateIsProcessed(query);

        // Assert
        await repository.Received().ExecuteAsync(Arg.Any<UpdateIsProcessedForRequestTicketsCriteria>());
    }
}