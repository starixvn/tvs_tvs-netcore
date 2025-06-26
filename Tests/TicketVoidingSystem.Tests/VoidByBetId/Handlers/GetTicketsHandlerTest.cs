using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VoidByBetId.Handlers;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.GetTickets;
using SpecialDelete.VoidByBetId.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Handlers;

[Category("VoidByBetId")]
public class GetTicketsHandlerTest
{
    private readonly GetTicketsService _getTicketsService;
    private readonly PagingService _pagingService;
    private readonly GetTicketsHandler _handler;

    public GetTicketsHandlerTest()
    {
        _getTicketsService = Substitute.For<GetTicketsService>();
        _pagingService = Substitute.For<PagingService>();
        _handler = new GetTicketsHandler(_getTicketsService, _pagingService);
    }

    [Fact]
    public async Task Handle_ValidRequest_ReturnsTicketsViewModel()
    {
        // Arrange
        var request = new GetTicketsRequest();
        var expectedTickets = new List<GetTicketModel>();
        _getTicketsService.GetTickets(request).Returns((expectedTickets, "", "", 0));
        _getTicketsService.AssignData(Arg.Any<Group<GetTicketModel>>()).ReturnsForAnyArgs(new Group<TicketViewModel>());

        // Act
        var result = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<TicketsViewModel>(result);
    }

    [Fact]
    public async Task Handle_WithTickets_UpdatesViewModelCorrectly()
    {
        // Arrange
        var request = new GetTicketsRequest();
        var tickets = new List<GetTicketModel>
        {
            new() { TransId = 1, BetType = 0, IsDeposit = false, GroupName = "Credit" },
            new() { TransId = 2, BetType = BetTypeConstant.SystemParlay, IsDeposit = true, GroupName = "Deposit" },
            new() { TransId = 3, BetType = BetTypeConstant.SystemParlay, IsDeposit = false, GroupName = "Deposit" }
        };

        _getTicketsService.GetTickets(request).Returns((tickets, "", "", 0));
        _getTicketsService.AssignData(Arg.Any<Group<GetTicketModel>>()).ReturnsForAnyArgs(new Group<TicketViewModel>());
        _pagingService.Groups(Arg.Any<IEnumerable<GetTicketModel>>(), Arg.Any<Func<GetTicketModel, string>>())
            .Returns(new List<Group<GetTicketModel>>
            {
                new() { Name = GroupTicket.Credit, Tickets = tickets.Where(t => t.GroupName == "Credit").ToList() },
                new() { Name = GroupTicket.Deposit, Tickets = tickets.Where(t => t.GroupName == "Deposit").ToList() }
            });

        // Act
        var result = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(3, result.TotalItems);
        Assert.Equal(1, result.SingleCount);
        Assert.Equal(2, result.ParlayCount);
    }

    [Fact]
    public async Task Handle_WithInvalidTransIds_UpdatesViewModelWithInvalidIds()
    {
        // Arrange
        var request = new GetTicketsRequest();
        const string invalidTransIds = "1,2,3";
        var tickets = new List<GetTicketModel>();

        _getTicketsService.GetTickets(request).Returns((tickets, invalidTransIds, "", 0));
        _getTicketsService.AssignData(Arg.Any<Group<GetTicketModel>>()).ReturnsForAnyArgs(new Group<TicketViewModel>());

        // Act
        var result = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(invalidTransIds, result.InvalidTransIds);
    }

    [Fact]
    public async Task Handle_WithMovedTransIds_UpdatesViewModelWithMovedIds()
    {
        // Arrange
        var request = new GetTicketsRequest();
        var movedTransIds = "4,5,6";
        var tickets = new List<GetTicketModel>();

        _getTicketsService.GetTickets(request).Returns((tickets, "", movedTransIds, 0));
        _getTicketsService.AssignData(Arg.Any<Group<GetTicketModel>>()).ReturnsForAnyArgs(new Group<TicketViewModel>());

        // Act
        var result = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(movedTransIds, result.MovedTransIds);
    }

    [Fact]
    public async Task Handle_WithMatchId_UpdatesViewModelWithMatchId()
    {
        // Arrange
        var request = new GetTicketsRequest();
        var matchId = 123;
        var tickets = new List<GetTicketModel>();

        _getTicketsService.GetTickets(request).Returns((tickets, "", "", matchId));
        _getTicketsService.AssignData(Arg.Any<Group<GetTicketModel>>()).ReturnsForAnyArgs(new Group<TicketViewModel>());

        // Act
        var result = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(matchId, result.MatchId);
    }
}