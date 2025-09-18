using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest;

public class GetVoidedTicketsHandlerTests
{
    [Fact]
    public async Task Handle_ReturnsVoidedTicketsViewModel()
    {
        // Arrange
        var request = new GetVoidedTicketsRequest();
        var getVoidedTicketsService = Substitute.For<GetVoidedTicketsService>();
        var mapTicketsService = Substitute.For<MapTicketsService>();
        var handler = new GetVoidedTicketsHandler(getVoidedTicketsService, mapTicketsService);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.IsType<VoidedTicketsViewModel>(result);
    }

    [Fact]
    public async Task Handle_CallsGetTicketsInGetVoidedTicketsService()
    {
        // Arrange
        var request = new GetVoidedTicketsRequest();
        var getVoidedTicketsService = Substitute.For<GetVoidedTicketsService>();
        var mapTicketsService = Substitute.For<MapTicketsService>();
        var handler = new GetVoidedTicketsHandler(getVoidedTicketsService, mapTicketsService);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await getVoidedTicketsService.Received(1).GetTickets(request);
    }

    [Fact]
    public async Task Handle_RequestHasMatchIdIs0_ExpectedReceived()
    {
        // Arrange
        var request = new GetVoidedTicketsRequest { IssueTypeId = 11, MatchId = 0 };
        var getVoidedTicketsService = Substitute.For<GetVoidedTicketsService>();
        var mapTicketsService = Substitute.For<MapTicketsService>();
        var handler = new GetVoidedTicketsHandler(getVoidedTicketsService, mapTicketsService);
        var voidedTickets = new List<VoidedTicketModel>
        {
            new() { IsCancelCashOut = true, GroupName = "Deposit" },
            new() { IsCancelCashOut = false, GroupName = "11 Deposit" }
        };
        getVoidedTicketsService.GetTickets(request).Returns(voidedTickets);
        var groups = new List<Group<VoidedTicketModel>> { new() { Tickets = new List<VoidedTicketModel> { new() } } };
        mapTicketsService.MapToGroupVoidedTickets(Arg.Any<List<VoidedTicketModel>>(), Arg.Any<GetVoidedTicketsQuery>())
            .ReturnsForAnyArgs(groups);
        var groupViewModel = new Group<VoidedTicketViewModel>();
        mapTicketsService.MapToGroupVoidedTicketsViewModel(Arg.Any<Group<VoidedTicketModel>>(), Arg.Any<Match>(), 0,
                Arg.Any<GetVoidedTicketsQuery>()).ReturnsForAnyArgs(groupViewModel);
        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        mapTicketsService.Received()
            .MapToGroupVoidedTickets(Arg.Any<List<VoidedTicketModel>>(), Arg.Any<GetVoidedTicketsRequest>());
    }

    [Fact]
    public async Task Handle_RequestHasMatchId_ExpectedReceived()
    {
        // Arrange
        var request = new GetVoidedTicketsRequest { IssueTypeId = 11, MatchId = 1 };
        var getVoidedTicketsService = Substitute.For<GetVoidedTicketsService>();
        var mapTicketsService = Substitute.For<MapTicketsService>();
        var handler = new GetVoidedTicketsHandler(getVoidedTicketsService, mapTicketsService);
        var voidedTickets = new List<VoidedTicketModel>
        {
            new() { IsCancelCashOut = true, GroupName = "Deposit" },
            new() { IsCancelCashOut = false, GroupName = "11 Deposit" }
        };
        getVoidedTicketsService.GetTickets(request).Returns(voidedTickets);
        var groups = new List<Group<VoidedTicketModel>> { new() { Tickets = new List<VoidedTicketModel> { new() } } };
        mapTicketsService.MapToGroupVoidedTickets(Arg.Any<List<VoidedTicketModel>>(), Arg.Any<GetVoidedTicketsQuery>())
            .ReturnsForAnyArgs(groups);
        var groupViewModel = new Group<VoidedTicketViewModel>();
        mapTicketsService.MapToGroupVoidedTicketsViewModel(Arg.Any<Group<VoidedTicketModel>>(), Arg.Any<Match>(), 0,
                Arg.Any<GetVoidedTicketsQuery>()).ReturnsForAnyArgs(groupViewModel);
        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await getVoidedTicketsService.Received(1).GetTickets(request);
        mapTicketsService.Received()
            .MapToGroupVoidedTickets(Arg.Any<List<VoidedTicketModel>>(), Arg.Any<GetVoidedTicketsRequest>());
    }

    [Fact]
    public async Task Handle_CallsMapToGroupVoidedTicketsInMapTicketsServiceForEachGroup()
    {
        // Arrange
        var request = new GetVoidedTicketsRequest { IssueTypeId = 11 };
        var getVoidedTicketsService = Substitute.For<GetVoidedTicketsService>();
        var mapTicketsService = Substitute.For<MapTicketsService>();
        var handler = new GetVoidedTicketsHandler(getVoidedTicketsService, mapTicketsService);
        var voidedTickets = new List<VoidedTicketModel>
        {
            new() { IsCancelCashOut = true, GroupName = "Deposit" },
            new() { IsCancelCashOut = false, GroupName = "11 Deposit" }
        };
        getVoidedTicketsService.GetTickets(request).Returns(voidedTickets);
        var groups = new List<Group<VoidedTicketModel>> { new() { Tickets = new List<VoidedTicketModel> { new() } } };
        mapTicketsService.MapToGroupVoidedTickets(Arg.Any<List<VoidedTicketModel>>(), Arg.Any<GetVoidedTicketsQuery>())
            .ReturnsForAnyArgs(groups);
        var groupViewModel = new Group<VoidedTicketViewModel>();
        mapTicketsService.MapToGroupVoidedTicketsViewModel(Arg.Any<Group<VoidedTicketModel>>(), Arg.Any<Match>(), 0, Arg.Any<GetVoidedTicketsQuery>())
            .ReturnsForAnyArgs(groupViewModel);
        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        mapTicketsService.Received().MapToGroupVoidedTickets(Arg.Any<List<VoidedTicketModel>>(), Arg.Any<GetVoidedTicketsRequest>());
    }
}