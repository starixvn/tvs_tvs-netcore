using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest.InsertQueue;

public class ValidationTicketsServiceTests
{
    [Theory]
    [InlineData(IssueTypeConstant.DangerAccepted)]
    [InlineData(IssueTypeConstant.RedCard)]
    [InlineData(IssueTypeConstant.WrongScore)]
    [InlineData(IssueTypeConstant.AbnormalAccount)]
    public async Task RecheckTicketsStatus_IssueTypeNeedToRecheckValidationTickets_CallExpected(int issueTypeId)
    {
        // Arrange
        var query = new InsertQueueQuery
        {
            IssueTypeId = issueTypeId,
            SingleTickets = new List<BetId> { new() { TransId = "1" }, new() { TransId = "2", SiteDbGroupId = 1 } },
            ParlayTickets = new List<BetId> { new() { TransId = "3" }, new() { TransId = "4", SiteDbGroupId = 1 } },
            CricketTickets = new List<BetId> { new() { TransId = "5" }, new() { TransId = "6", SiteDbGroupId = 1 } },
            CancelCashOutTickets = new List<BetId> { new() { TransId = "7" }, new() { TransId = "8", SiteDbGroupId = 1 } },
        };
        var mappingTypes = new[] {
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel)
        };
        IEnumerable<object>[] results = {
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()}
        };
        var repository = Substitute.For<IDynamicRepository>();
        var mapTicketsService = Substitute.For<MapTicketsService>();
        repository.FetchMultipleAsync(Arg.Any<CheckTicketsAllowToVoidCriteria>(), mappingTypes).ReturnsForAnyArgs(results);
        mapTicketsService.MapBetIdToRequestDetailTicket(Arg.Any<IEnumerable<BetId>>(), 0, issueTypeId).ReturnsForAnyArgs(new List<RequestDetailTicketModel>());
        var service = new ValidationTicketsServiceImp(repository, mapTicketsService);

        // Act
        await service.RecheckTicketsStatus(query, 0);

        // Assert
        mapTicketsService.Received(4).MapBetIdToRequestDetailTicket(Arg.Any<IEnumerable<BetId>>(), 0, issueTypeId);
        await repository.Received().FetchMultipleAsync(Arg.Any<CheckTicketsAllowToVoidCriteria>(), Arg.Any<Type[]>());
    }

    [Fact]
    public async Task RecheckTicketsStatus_IssueTypeNotNeedToRecheckValidationTickets_NotCallFetchMultipleAsync()
    {
        // Arrange
        var query = new InsertQueueQuery
        {
            IssueTypeId = IssueTypeConstant.EarlyKickOffTime,
            SingleTickets = new List<BetId> { new() { TransId = "1" }, new() { TransId = "2", SiteDbGroupId = 1 } },
            ParlayTickets = new List<BetId> { new() { TransId = "3" }, new() { TransId = "4", SiteDbGroupId = 1 } },
            CricketTickets = new List<BetId> { new() { TransId = "5" }, new() { TransId = "6", SiteDbGroupId = 1 } },
            CancelCashOutTickets = new List<BetId> { new() { TransId = "7" }, new() { TransId = "8", SiteDbGroupId = 1 } },
        };
        var mappingTypes = new[] {
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel)
        };
        IEnumerable<object>[] results = {
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()},
            new List<RequestDetailTicketModel>{new()}
        };
        var repository = Substitute.For<IDynamicRepository>();
        var mapTicketsService = Substitute.For<MapTicketsService>();
        repository.FetchMultipleAsync(Arg.Any<CheckTicketsAllowToVoidCriteria>(), mappingTypes).ReturnsForAnyArgs(results);
        var service = new ValidationTicketsServiceImp(repository, mapTicketsService);

        // Act
        await service.RecheckTicketsStatus(query, 0);

        // Assert
        await repository.Received(0).FetchMultipleAsync(Arg.Any<CheckTicketsAllowToVoidCriteria>(), Arg.Any<Type[]>());
    }
}