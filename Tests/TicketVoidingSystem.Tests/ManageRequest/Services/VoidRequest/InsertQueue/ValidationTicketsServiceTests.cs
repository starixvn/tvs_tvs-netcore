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
            CancelCashOutTickets = new List<BetId> { new() { TransId = "7" }, new() { TransId = "8", SiteDbGroupId = 1 } }
        };

        var results = new List<RequestDetailTicketModel> { new() };
        var repository = Substitute.For<IDynamicRepository>();
        var mapTicketsService = Substitute.For<MapTicketsService>();
        repository.FetchAsync<RequestDetailTicketModel>(Arg.Any<CheckTicketsAllowToVoidCriteria>())
            .ReturnsForAnyArgs(results);
        mapTicketsService.MapBetIdToRequestDetailTicket(Arg.Any<IEnumerable<BetId>>(), 0, issueTypeId).ReturnsForAnyArgs(new List<RequestDetailTicketModel>());
        var service = new ValidationTicketsServiceImp(repository, mapTicketsService);

        // Act
        await service.RecheckTicketsStatus(query);

        // Assert
        mapTicketsService.Received(8).MapBetIdToRequestDetailTicket(Arg.Any<IEnumerable<BetId>>(), 0, issueTypeId);
        await repository.Received(2).FetchAsync<RequestDetailTicketModel>(Arg.Any<CheckTicketsAllowToVoidCriteria>());
    }

    [Fact]
    public async Task RecheckTicketsStatus_IssueTypeNotNeedToRecheckValidationTickets_NotCallFetchMultipleAsync()
    {
        // Arrange
        var query = new InsertQueueQuery
        {
            RequestId = 73642,
            IssueTypeId = IssueTypeConstant.EarlyKickOffTime,
            SingleTickets = new List<BetId> { new() { TransId = "1" }, new() { TransId = "2", SiteDbGroupId = 1 } },
            ParlayTickets = new List<BetId> { new() { TransId = "3" }, new() { TransId = "4", SiteDbGroupId = 1 } },
            CricketTickets = new List<BetId> { new() { TransId = "5" }, new() { TransId = "6", SiteDbGroupId = 1 } },
            CancelCashOutTickets = new List<BetId> { new() { TransId = "7" }, new() { TransId = "8", SiteDbGroupId = 1 } }
        };
        var tickets = new List<RequestDetailTicketModel> { new() };
        var repository = Substitute.For<IDynamicRepository>();
        var mapTicketsService = Substitute.For<MapTicketsService>();
        mapTicketsService.SetVoidingTypeForTickets(default).ReturnsForAnyArgs(tickets);
        var service = new ValidationTicketsServiceImp(repository, mapTicketsService);

        // Act
        var actual = await service.RecheckTicketsStatus(query);

        // Assert
        await repository.DidNotReceive().FetchAsync<RequestDetailTicketModel>(Arg.Any<CheckTicketsAllowToVoidCriteria>());
        AssertExtension.Equal(tickets, actual);
    }
}