using System.Collections.Generic;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LinkedLog;

public class GetPoolHouseTicketServiceTests
{
    private readonly MapTicketsService mapTicketsService;
    private readonly PagingService pagingService;
    private readonly GetPoolHouseTicketServiceImp service;

    public GetPoolHouseTicketServiceTests()
    {
        mapTicketsService = Substitute.For<MapTicketsService>();
        pagingService = Substitute.For<PagingService>();
        service = new GetPoolHouseTicketServiceImp(mapTicketsService, pagingService);
    }

    [Fact]
    public void GetTicketsViewModel_NoHasOriginTickets_ReturnEmptyGroups()
    {
        // Arrange
        var originTickets = new List<GetTicketModel>();
        var request = new GetPoolHouseTicketRequest();
        var expected = new TicketsViewModel
        {
            TotalSingle = 0,
            TotalParlay = 0,
            Groups = []
        };

        // Act
        var actual = service.GetTicketsViewModel(originTickets, request);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public void GetTicketsViewModel_NoHasAfterPagingTickets_ReturnEmptyGroups()
    {
        // Arrange
        var originTickets = new List<GetTicketModel> { new() };
        var request = new GetPoolHouseTicketRequest();
        var expected = new TicketsViewModel
        {
            TotalSingle = 1,
            TotalParlay = 0,
            Groups = []
        };

        // Act
        var actual = service.GetTicketsViewModel(originTickets, request);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public void GetTicketsViewModel_HasAfterPagingTickets_ReturnExpected()
    {
        // Arrange
        var originTickets = new List<GetTicketModel>
        {
            new() { IsMixParlay = true, GroupName = "Credit (Parlay)" },
            new() { IsMixParlay = true, GroupName = "Deposit (Parlay)", IsDeposit = true},
            new() { IsMixParlay = true, GroupName = "1" },
            new() { IsMixParlay = false, GroupName = "Others" },
            new() { IsMixParlay = false, GroupName = "1" }
        };
        var request = new GetPoolHouseTicketRequest { IssueTypeId = 1 };
        var singleTickets = new List<GetTicketModel>
        {
            new() { IsMixParlay = false, GroupName = "1" }
        };
        List<Group<GetTicketModel>> groups = [new() { Name = "1", Tickets = singleTickets, DisplayTotalTickets = 1 }];
        pagingService.Groups(singleTickets, ticket => ticket.GroupName).ReturnsForAnyArgs(groups);
        mapTicketsService
            .MapFromGetTicketModelToTicketViewModel(Arg.Any<GetTicketModel>(), null, ChoiceType.None, 1)
            .ReturnsForAnyArgs(new TicketViewModel());
        var expectedGroups = new List<Group<TicketViewModel>>
        {
            new() { Name = "1", Tickets = new List<TicketViewModel> { new() { No = 0 } }, DisplayTotalTickets = 2 },
            new()
            {
                Name = "Credit (Parlay)", Tickets = new List<TicketViewModel> { new() { No = 0 } }, DisplayTotalTickets = 1
            },
            new()
            {
                Name = "Deposit (Parlay)", Tickets = new List<TicketViewModel> { new() { No = 0 } }, DisplayTotalTickets = 1
            },
            new() { Name = "Others", Tickets = new List<TicketViewModel> { new() { No = 0 } }, DisplayTotalTickets = 1 }
        };
        var expected = new TicketsViewModel
        {
            TotalSingle = 2,
            TotalParlay = 3,
            Groups = expectedGroups
        };

        // Act
        var actual = service.GetTicketsViewModel(originTickets, request);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}