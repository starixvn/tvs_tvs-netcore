using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.VoidSingleBet.Handlers;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Handlers;

public class GetTicketsHandlerTests
{
    private GetTicketsService getTicketsService;
    private MatchService matchService;
    private GroupTicketService groupTicketService;
    private UpdateListTicketsViewModelService updateListTicketsViewModelService;

    private void InitGetTicketsHandlerTests()
    {
        getTicketsService = Substitute.For<GetTicketsService>();
        matchService = Substitute.For<MatchService>();
        groupTicketService = Substitute.For<GroupTicketService>();
        updateListTicketsViewModelService = Substitute.For<UpdateListTicketsViewModelService>();
    }

    [Fact]
    public async Task Handler_WhenCreateGroupsGetTicketModelHaveEmptyData_ReturnViewModelWithEmptyGroup()
    {
        // Arrange
        InitGetTicketsHandlerTests();
        var request = new GetTicketsRequest { MatchId = 1 };
        var listGroup = new List<Group<GetTicketModel>>{ new() { Tickets = new List<GetTicketModel>() }
            };
        var getTicketsResult = new List<GetTicketModel>();
        getTicketsService.GetTickets(request).ReturnsForAnyArgs(getTicketsResult);
        groupTicketService.CreateGroupsGetTicketModel(default, default).ReturnsForAnyArgs(listGroup);
        var handler = new GetTicketsHandler(getTicketsService, matchService, groupTicketService, updateListTicketsViewModelService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await groupTicketService.ReceivedWithAnyArgs(0).CreateGroupTicketViewModel(default, default);
        await updateListTicketsViewModelService.ReceivedWithAnyArgs(1).Update(default, default, default);
        Assert.Empty(actual.Groups);
    }

    [Fact]
    public async Task Handler_WhenCreateGroupsGetTicketModelHaveData_ReturnViewModelWithExpectedGroups()
    {
        // Arrange
        InitGetTicketsHandlerTests();
        var request = new GetTicketsRequest { MatchId = 1 };
        var listGroup = new List<Group<GetTicketModel>> { new() { Tickets = new List<GetTicketModel> { new() } }, new() { Tickets = new List<GetTicketModel> { new() } } };
        var getTicketsResult = new List<GetTicketModel>();
        getTicketsService.GetTickets(request).ReturnsForAnyArgs(getTicketsResult);
        groupTicketService.CreateGroupsGetTicketModel(default, default).ReturnsForAnyArgs(listGroup);
        var handler = new GetTicketsHandler(getTicketsService, matchService, groupTicketService, updateListTicketsViewModelService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await groupTicketService.ReceivedWithAnyArgs(2).CreateGroupTicketViewModel(default, default);
        await updateListTicketsViewModelService.ReceivedWithAnyArgs(1).Update(default, default, default);
        Assert.Equal(2, actual.Groups.Count());
    }
}