using NSubstitute;
using TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Handlers.MarkUnmarkTickets;

public class GetDetailTicketsHandlerTests
{
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
            new() { TransId = 12345, IsMixParlay = true, IsDeposit = true, LicenseeName = "CN88"},
            new() { TransId = 12346, IsMixParlay = true, IsDeposit = true, LicenseeName = "CN89"},
            new() { TransId = 12347, IsMixParlay = true, IsDeposit = true, LicenseeName = "CN90"},
            new() { TransId = 12348, IsMixParlay = false, IsDeposit = false, LicenseeName = "CN91"},
            new() { TransId = 12349, IsMixParlay = true, IsDeposit = false, LicenseeName = "CN91"},
        };
        var groups = new List<Group<GetTicketModel>>
        {
            new() {Name = "Credit", Tickets = data }
        };

        var getTicketsService = Substitute.For<GetTicketsService>();
        var mapTicketService = Substitute.For<MapTicketService>();
        var pagingService = Substitute.For<PagingService>();
        getTicketsService.GetDetailTickets(default).ReturnsForAnyArgs(data);
        pagingService.Groups(new List<GetTicketModel>(), ticket => ticket.GroupName).ReturnsForAnyArgs(groups);
        pagingService.Paging(new List<GetTicketModel>(), 500, 300).ReturnsForAnyArgs(data);

        var handler = new GetDetailTicketsHandler(getTicketsService, mapTicketService, pagingService);

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

        var getTicketsService = Substitute.For<GetTicketsService>();
        var mapTicketService = Substitute.For<MapTicketService>();
        var pagingService = Substitute.For<PagingService>();
        getTicketsService.GetDetailTickets(default).ReturnsForAnyArgs(data);
        pagingService.Groups(new List<GetTicketModel>(), ticket => ticket.GroupName).ReturnsForAnyArgs(groups);
        pagingService.Paging(new List<GetTicketModel>(), 500, 300).ReturnsForAnyArgs(data);

        var handler = new GetDetailTicketsHandler(getTicketsService, mapTicketService, pagingService);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        await getTicketsService.Received(1).GetDetailTickets(Arg.Compat.Is<GetDetailTicketsRequest>(x => x.MatchId == 9000001));
        pagingService.Received(1).Paging(Arg.Any<List<GetTicketModel>>(), 500, 300);
        Assert.Equal(0, result.TotalItems);
    }
}