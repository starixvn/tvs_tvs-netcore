using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SignalR;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest;

public class InsertQueueServiceTests
{
    private static InsertQueueServiceImp CreateService(
        RepositoryService repositoryService,
        ValidationTicketsService validationTicketsService,
        InsertVoidingHistoryService insertVoidingHistoryService,
        NotificationSignalRService signalRService) =>
        new(repositoryService, validationTicketsService, insertVoidingHistoryService, signalRService);

    [Fact]
    public async Task InsertTicketVoidingQueue_NoServerFound_StatusFailed()
    {
        // Arrange
        var repository = Substitute.For<RepositoryService>();
        var validation = Substitute.For<ValidationTicketsService>();
        var history = Substitute.For<InsertVoidingHistoryService>();
        var signalR = Substitute.For<NotificationSignalRService>();

        var tickets = new List<RequestDetailTicketModel>();
        validation.RecheckTicketsStatus(Arg.Any<InsertQueueQuery>()).Returns(tickets);
        repository.GetServerInsertQueue(tickets).Returns([]);

        var service = CreateService(repository, validation, history, signalR);
        var query = new InsertQueueQuery { RequestId = 123, IssueTypeId = IssueTypeConstant.DangerAccepted };

        // Act
        await service.InsertTicketVoidingQueue(query);

        // Assert
        await validation.Received(1).RecheckTicketsStatus(query);
        await repository.Received(1).GetServerInsertQueue(tickets);
        await signalR.Received(1).UpdateRequestStatusToAllUser(Arg.Is<IEnumerable<RequestStatus>>(s =>
            s.Single().RequestId == 123 && s.Single().Status == "Failed"));
        await history.DidNotReceiveWithAnyArgs().InsertVoidingHistory(default!, default, default!, default!);
        await repository.DidNotReceiveWithAnyArgs().InsertQueueBySiteDb(default, default, default, default!);
    }

    [Fact]
    public async Task InsertTicketVoidingQueue_WrongMarketOffered_BuildsTransIdsJson()
    {
        // Arrange
        var repository = Substitute.For<RepositoryService>();
        var validation = Substitute.For<ValidationTicketsService>();
        var history = Substitute.For<InsertVoidingHistoryService>();
        var signalR = Substitute.For<NotificationSignalRService>();

        var tickets = new List<RequestDetailTicketModel>
        {
            // Parlay first
            new() { SiteDbGroupId = 10, VoidingTypeId = VoidingTypeConstant.Parlay, TransId = 111 },
            // Single (any non-parlay value)
            new() { SiteDbGroupId = 10, VoidingTypeId = VoidingTypeConstant.Parlay + 999, TransId = 222 }
        };
        validation.RecheckTicketsStatus(Arg.Any<InsertQueueQuery>()).Returns(tickets);
        repository.GetServerInsertQueue(tickets).Returns([10]);
        history.InsertVoidingHistory(default!, default, default!, default!)
            .ReturnsForAnyArgs(999); // dummy id

        var service = CreateService(repository, validation, history, signalR);
        var query = new InsertQueueQuery { RequestId = 55, IssueTypeId = IssueTypeConstant.WrongMarketOffered };

        // Act
        await service.InsertTicketVoidingQueue(query);

        // Assert
        await history.Received(1).InsertVoidingHistory(
            query,
            10,
            Arg.Any<string>(),
            Arg.Is<string>(json => ValidateTransIds(json, "222", "111")));
        await repository.Received(1).InsertQueueBySiteDb(10, 999, 55, Arg.Is<IEnumerable<RequestDetailTicketModel>>(t => t.Count() == 2));
        await signalR.Received(1).UpdateRequestStatusToAllUser(Arg.Is<IEnumerable<RequestStatus>>(s => s.Single().Status == "Running"));
    }

    [Fact]
    public async Task InsertTicketVoidingQueue_NotWrongMarketOffered_TransIdsNull()
    {
        // Arrange
        var repository = Substitute.For<RepositoryService>();
        var validation = Substitute.For<ValidationTicketsService>();
        var history = Substitute.For<InsertVoidingHistoryService>();
        var signalR = Substitute.For<NotificationSignalRService>();

        var tickets = new List<RequestDetailTicketModel>
        {
            new() { SiteDbGroupId = 1, VoidingTypeId = VoidingTypeConstant.Parlay, TransId = 1 },
            new() { SiteDbGroupId = 1, VoidingTypeId = VoidingTypeConstant.Parlay + 1, TransId = 2 }
        };
        validation.RecheckTicketsStatus(Arg.Any<InsertQueueQuery>()).Returns(tickets);
        repository.GetServerInsertQueue(tickets).Returns([1]);
        history.InsertVoidingHistory(default!, default, default!, default!)
            .ReturnsForAnyArgs(1);

        var service = CreateService(repository, validation, history, signalR);
        var query = new InsertQueueQuery { RequestId = 1, IssueTypeId = IssueTypeConstant.DangerAccepted };

        // Act
        await service.InsertTicketVoidingQueue(query);

        // Assert
        await history.Received(1).InsertVoidingHistory(
            query,
            1,
            Arg.Any<string>(),
            Arg.Is<string>(s => s == null));
    }

    [Fact]
    public async Task InsertTicketVoidingQueue_MultipleServers_ProcessEachServer()
    {
        // Arrange
        var repository = Substitute.For<RepositoryService>();
        var validation = Substitute.For<ValidationTicketsService>();
        var history = Substitute.For<InsertVoidingHistoryService>();
        var signalR = Substitute.For<NotificationSignalRService>();

        var tickets = new List<RequestDetailTicketModel>
        {
            new() { SiteDbGroupId = 1, VoidingTypeId = VoidingTypeConstant.Parlay + 5, TransId = 10 },
            new() { SiteDbGroupId = 2, VoidingTypeId = VoidingTypeConstant.Parlay, TransId = 20 },
            new() { SiteDbGroupId = 1, VoidingTypeId = VoidingTypeConstant.Parlay, TransId = 30 },
            new() { SiteDbGroupId = 2, VoidingTypeId = VoidingTypeConstant.Parlay + 5, TransId = 40 },
        };
        validation.RecheckTicketsStatus(Arg.Any<InsertQueueQuery>()).Returns(tickets);
        repository.GetServerInsertQueue(tickets).Returns([1, 2]);
        history.InsertVoidingHistory(default!, default, default!, default!).ReturnsForAnyArgs(ci => ci.ArgAt<int>(1) * 100); // return based on siteDbGroupId

        var service = CreateService(repository, validation, history, signalR);
        var query = new InsertQueueQuery { RequestId = 77, IssueTypeId = IssueTypeConstant.WrongMarketOffered };

        // Act
        await service.InsertTicketVoidingQueue(query);

        // Assert
        await history.Received(1).InsertVoidingHistory(query, 1, Arg.Any<string>(), Arg.Any<string>());
        await history.Received(1).InsertVoidingHistory(query, 2, Arg.Any<string>(), Arg.Any<string>());
        await repository.Received(1).InsertQueueBySiteDb(1, 100, 77, Arg.Is<IEnumerable<RequestDetailTicketModel>>(t => t.All(x => x.SiteDbGroupId == 1)));
        await repository.Received(1).InsertQueueBySiteDb(2, 200, 77, Arg.Is<IEnumerable<RequestDetailTicketModel>>(t => t.All(x => x.SiteDbGroupId == 2)));
        await signalR.Received(1).UpdateRequestStatusToAllUser(Arg.Is<IEnumerable<RequestStatus>>(s => s.Single().Status == "Running"));
    }

    private static bool ValidateTransIds(string json, string single, string parlay)
    {
        if (json == null) return false;
        try
        {
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            return root.GetProperty("SingleTransIds").GetString() == single &&
                   root.GetProperty("ParlayTransIds").GetString() == parlay;
        }
        catch
        {
            return false;
        }
    }
}