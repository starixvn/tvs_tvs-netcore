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
        groupTicketService.CreateGroupsGetTicketModel(null, null).ReturnsForAnyArgs(listGroup);
        var handler = new GetTicketsHandler(getTicketsService, matchService, groupTicketService, updateListTicketsViewModelService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await groupTicketService.ReceivedWithAnyArgs(0).CreateGroupTicketViewModel(null, null);
        await updateListTicketsViewModelService.ReceivedWithAnyArgs(1).Update(null, null, 0, 27);
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
        groupTicketService.CreateGroupsGetTicketModel(null, null).ReturnsForAnyArgs(listGroup);
        var handler = new GetTicketsHandler(getTicketsService, matchService, groupTicketService, updateListTicketsViewModelService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await groupTicketService.ReceivedWithAnyArgs(2).CreateGroupTicketViewModel(null, null);
        await updateListTicketsViewModelService.ReceivedWithAnyArgs(1).Update(null, null, 0, 27);
        Assert.Equal(2, actual.Groups.Count());
    }

    [Fact]
    public async Task Handler_WhenMatchNotFound_ShouldNotCreateGroups()
    {
        // Arrange
        InitGetTicketsHandlerTests();
        var request = new GetTicketsRequest { MatchId = 1 };
        var getTicketsResult = new List<GetTicketModel> { new() };
        getTicketsService.GetTickets(request).ReturnsForAnyArgs(getTicketsResult);
        matchService.GetMatch(request.MatchId).ReturnsForAnyArgs(Task.FromResult<Match>(null));
        var handler = new GetTicketsHandler(getTicketsService, matchService, groupTicketService, updateListTicketsViewModelService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await groupTicketService.ReceivedWithAnyArgs(0).CreateGroupTicketViewModel(null, null);
        await updateListTicketsViewModelService.ReceivedWithAnyArgs(1).Update(null, null, 0, 27);
        Assert.Empty(actual.Groups);
    }

    [Fact]
    public async Task Handler_WhenGetTicketsThrowsException_ShouldPropagateException()
    {
        // Arrange
        InitGetTicketsHandlerTests();
        var request = new GetTicketsRequest { MatchId = 1 };
        getTicketsService.GetTickets(request).ReturnsForAnyArgs(_ => Task.FromException<IList<GetTicketModel>>(new System.Exception("Test exception")));
        var handler = new GetTicketsHandler(getTicketsService, matchService, groupTicketService, updateListTicketsViewModelService);

        // Act & Assert
        await Assert.ThrowsAsync<System.Exception>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handler_WhenCreateGroupsGetTicketModelHaveEmptyTickets_ShouldSkipEmptyGroups()
    {
        // Arrange
        InitGetTicketsHandlerTests();
        var request = new GetTicketsRequest { MatchId = 1 };
        var listGroup = new List<Group<GetTicketModel>> 
        { 
            new() { Tickets = new List<GetTicketModel>() },
            new() { Tickets = new List<GetTicketModel> { new() } },
            new() { Tickets = new List<GetTicketModel>() }
        };
        var getTicketsResult = new List<GetTicketModel>();
        getTicketsService.GetTickets(request).ReturnsForAnyArgs(getTicketsResult);
        groupTicketService.CreateGroupsGetTicketModel(null, null).ReturnsForAnyArgs(listGroup);
        var handler = new GetTicketsHandler(getTicketsService, matchService, groupTicketService, updateListTicketsViewModelService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await groupTicketService.ReceivedWithAnyArgs(1).CreateGroupTicketViewModel(null, null);
        await updateListTicketsViewModelService.ReceivedWithAnyArgs(1).Update(null, null, 0, 27);
        Assert.Single(actual.Groups);
    }
}