using NSubstitute;
using System.Collections.Generic;
using System.Linq;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.VoidedTickets;
public class MapTicketsServiceTests
{
    private readonly MapTicketsServiceImp mapTicketsService;
    private readonly PagingService pagingService;
    private readonly MapFromBetListService mapFromBetListService;

    public MapTicketsServiceTests()
    {
        pagingService = Substitute.For<PagingService>();
        mapFromBetListService = Substitute.For<MapFromBetListService>();

        mapTicketsService = new MapTicketsServiceImp(pagingService, mapFromBetListService);
    }

    [Fact]
    public void MapToGroupVoidedTickets_EmptyInput_ReturnEmptyGroupVoidedTicketModel()
    {
        // Arrange
        var originalTickets = Enumerable.Empty<VoidedTicketModel>();
        var query = new GetVoidedTicketsQuery { PageIndex = 1, PageSize = 10 };

        // Act
        var result = mapTicketsService.MapToGroupVoidedTickets(originalTickets, query);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public void MapToGroupVoidedTickets_HasInput_ReturnGroupVoidedTicketModel()
    {
        // Arrange
        var originalTickets = new List<VoidedTicketModel>
        {
            new()  { IsMixParlay = false, GroupName = "Group1" },
            new()  { IsMixParlay = false, GroupName = "Group2" },
        };
        var allGroups = new List<Group<VoidedTicketModel>>
        {
            new() { Name = "Group1", Tickets = new List<VoidedTicketModel>{new()} }
        };

        var query = new GetVoidedTicketsQuery { PageIndex = 1, PageSize = 10 };
        pagingService.Groups(Arg.Any<IEnumerable<VoidedTicketModel>>(), t => t.GroupName).ReturnsForAnyArgs(allGroups);

        // Act
        pagingService.Paging(Arg.Any<IEnumerable<VoidedTicketModel>>(), Arg.Any<int>(), Arg.Any<int>())
            .Returns(originalTickets);

        var result = mapTicketsService.MapToGroupVoidedTickets(originalTickets, query);

        // Assert
        var iEnumerable = result.ToList();
        Assert.Equal(2, iEnumerable.Count);
    }

    [Fact]
    public void MapToGroupVoidedTicketsViewModel_WithValidInput_ReturnsMappedGroup()
    {
        // Arrange
        var group = new Group<VoidedTicketModel>
        {
            Name = "Test Group",
            Tickets = new List<VoidedTicketModel>
            {
                new() { IsMixParlay = false,}
            },
        };

        mapFromBetListService
            .MapToVoidedTicketViewModel(Arg.Any<VoidedTicketModel>(), Arg.Any<Match>(), Arg.Any<ChoiceType>(),
                Arg.Any<int>()).Returns(new VoidedTicketViewModel());

        // Act
        var result = mapTicketsService.MapToGroupVoidedTicketsViewModel(group, new Match(), 0, 0);

        // Assert
        Assert.Equal(group.Name, result.Name);
    }
}
