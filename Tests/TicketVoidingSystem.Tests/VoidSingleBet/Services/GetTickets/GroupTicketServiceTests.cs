using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using TicketVoidingSystem.VoidSingleBet.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Services.GetTickets;

public class GroupTicketServiceTests
{
    private MapTicketService mapTicketService;
    private PagingService pagingService;
    private PermissionService permissionService;

    private void InItFakeServiceTest()
    {
        pagingService = Substitute.For<PagingService>();
        mapTicketService = Substitute.For<MapTicketService>();
        permissionService = Substitute.For<PermissionService>();
    }

    [Fact]
    public void CreateGroupsGetTicketModel_NoHasTickets_ReturnExpected()
    {
        // Arrange
        InItFakeServiceTest();
        var data = new List<GetTicketModel>();
        var query = new GetTicketsQuery();
        var expected = new List<Group<GetTicketModel>>();
        pagingService.Paging(data, query.PageIndex, query.PageSize).ReturnsForAnyArgs(new List<GetTicketModel>());
        var service = new GroupTicketServiceImp(pagingService, default, default);

        // Act
        var actual = service.CreateGroupsGetTicketModel(data, query);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public void CreateGroupsGetTicketModel_HasTickets_ReturnExpected()
    {
        // Arrange
        InItFakeServiceTest();
        var data = new List<GetTicketModel>();
        var query = new GetTicketsQuery();
        var tickets = new List<GetTicketModel>
        {
            new() { IsMixParlay = false, TransId = 1, GroupName = "1" },
            new() { IsMixParlay = true, TransId = 2 },
            new() { IsMixParlay = false, TransId = 3, GroupName = "1" }
        };
        var singleTickets = new List<GetTicketModel>
        {
            new() { IsMixParlay = false, TransId = 1, GroupName = "1" },
            new() { IsMixParlay = false, TransId = 3, GroupName = "1" }
        };
        var singleTicketGroups = new List<Group<GetTicketModel>> { new() { Name = "1", Tickets = singleTickets } };
        var expected = new List<Group<GetTicketModel>>
        {
            new() { Name = "1", Tickets = singleTickets },
            new()
            {
                Name = "Parlay", Tickets = new List<GetTicketModel>
                {
                    new() { IsMixParlay = true, TransId = 2 }
                }
            }
        };
        pagingService.Paging(data, query.PageIndex, query.PageSize).ReturnsForAnyArgs(tickets);
        pagingService.Groups(singleTickets, ticket => ticket.GroupName).ReturnsForAnyArgs(singleTicketGroups);
        var service = new GroupTicketServiceImp(pagingService, default, default);

        // Act
        var actual = service.CreateGroupsGetTicketModel(data, query);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task CreateGroupTicketViewModel_ReturnExpected()
    {
        // Arrange
        InItFakeServiceTest();
        var group = new Group<GetTicketModel> { Name = "1", Tickets = new List<GetTicketModel> { new() } };
        var match = new Match();
        var tickets = new TicketViewModel { MainTransId = "1" };
        var expected = new Group<TicketViewModel>
        { Name = group.Name, Tickets = new List<TicketViewModel> { tickets } };
        permissionService.GetUserPermission().ReturnsForAnyArgs(new UserPermission());
        mapTicketService.MapToTicketViewModel(Arg.Any<GetTicketModel>(), match, Arg.Any<UserPermission>())
            .ReturnsForAnyArgs(tickets);
        var service = new GroupTicketServiceImp(default, mapTicketService, permissionService);

        // Act
        var actual = await service.CreateGroupTicketViewModel(group, match);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}