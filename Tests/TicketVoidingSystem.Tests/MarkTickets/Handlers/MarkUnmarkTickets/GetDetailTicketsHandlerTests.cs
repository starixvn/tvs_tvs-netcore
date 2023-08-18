using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.MarkTickets.Handlers.MarkUnmarkTickets;

public class GetDetailTicketsHandlerTests: RemotingRefFixture
{
    private readonly GetTicketsService getTicketsService;
    private readonly PagingService pagingService;

    private readonly GetDetailTicketsHandler handler;

    public GetDetailTicketsHandlerTests()
    {
        getTicketsService = Substitute.For<GetTicketsService>();
        var mapTicketService = Substitute.For<MapTicketService>();
        pagingService = Substitute.For<PagingService>();
        var userPermissionService = Substitute.For<UserPermissionService>();
        handler = new GetDetailTicketsHandler(getTicketsService, mapTicketService, pagingService, userPermissionService);
    }

    [Fact]
    public async Task GetDetailTickets_HasTickets_ReturnTicketsDetail()
    {
        // Arrange
        var request = new GetDetailTicketsRequest
        {
            MatchId = 9000001,
            PageSize = 300,
            PageIndex = 500
        };
        var data = new List<GetTicketModel> {
            new() { TransId = 12345, SubTransId = 1, IsMixParlay = true, IsDeposit = true, LicenseeName = "CN88", SiteDbGroupId = 0},
            new() { TransId = 12346, SubTransId = 1,  IsMixParlay = true, IsDeposit = true, LicenseeName = "CN89", SiteDbGroupId = 0},
            new() { TransId = 12347, SubTransId = 1,  IsMixParlay = true, IsDeposit = true, LicenseeName = "CN90", SiteDbGroupId = 1},
            new() { TransId = 12348, SubTransId = 1,  IsMixParlay = false, IsDeposit = false, LicenseeName = "CN91", SiteDbGroupId = 0},
            new() { TransId = 12349, SubTransId = 1,  IsMixParlay = true, IsDeposit = false, LicenseeName = "CN91", SiteDbGroupId = 1}
        };
        var groups = new List<Group<GetTicketModel>>
        {
            new() {Name = "Credit", Tickets = data }
        };

        getTicketsService.GetDetailTickets(default).ReturnsForAnyArgs(data);
        pagingService.Groups(new List<GetTicketModel>(), ticket => ticket.GroupName).ReturnsForAnyArgs(groups);
        pagingService.Paging(new List<GetTicketModel>(), 500, 300).ReturnsForAnyArgs(data);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        await getTicketsService.Received(1).GetDetailTickets(Arg.Compat.Is<GetDetailTicketsRequest>(x => x.MatchId == 9000001));
        pagingService.Received(1).Paging(Arg.Any<List<GetTicketModel>>(), 500, 300);
        Assert.Equal("CN88, CN89, CN90", result.LicenseesName);
        Assert.Equal(4, result.ParlayCount);
        Assert.Equal(1, result.SingleCount);
        Assert.Equal(5, result.TotalItems);
    }

    [Fact]
    public async Task GetDetailTickets_HasNoTickets_ReturnEmptyModel()
    {
        // Arrange
        var request = new GetDetailTicketsRequest
        {
            MatchId = 9000001,
            PageSize = 300,
            PageIndex = 500
        };
        var data = new List<GetTicketModel>();
        var groups = new List<Group<GetTicketModel>>
        {
            new() {Name = "Credit", Tickets = data }
        };

        getTicketsService.GetDetailTickets(default).ReturnsForAnyArgs(data);
        pagingService.Groups(new List<GetTicketModel>(), ticket => ticket.GroupName).ReturnsForAnyArgs(groups);
        pagingService.Paging(new List<GetTicketModel>(), 500, 300).ReturnsForAnyArgs(data);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        await getTicketsService.Received(1).GetDetailTickets(Arg.Compat.Is<GetDetailTicketsRequest>(x => x.MatchId == 9000001));
        pagingService.Received(1).Paging(Arg.Any<List<GetTicketModel>>(), 500, 300);
        Assert.Equal(0, result.TotalItems);
    }
}