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
        updateListTicketsViewModelService.ReceivedWithAnyArgs(1).Update(default, default);
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
        updateListTicketsViewModelService.ReceivedWithAnyArgs(1).Update(default, default);
        Assert.Equal(2, actual.Groups.Count());
    }

    /*
    [Fact]
    public async Task GetTickets_NotHaveAnyTickets_ReturnEmptyTicketViewModel()
    {
        // Arrange
        var request = new GetTicketsRequest();
        var data = new List<GetTicketModel>();
        var getTicketsService = Substitute.For<GetTicketsService>();
        var matchService = Substitute.For<MatchService>();
        var sessionService = Substitute.For<SessionService>();
        var mapTicketService = Substitute.For<MapTicketService>();
        var updateListTicketsViewModelService = Substitute.For<UpdateListTicketsViewModelService>();
        getTicketsService.GetTickets(request).ReturnsForAnyArgs(data);
        var betListService = Substitute.For<BetListService>();
        betListService.GetBetTypeName(Arg.Compat.Any<Ticket>()).ReturnsForAnyArgs("");
        betListService.GetBetTypeNameChineseTraditional(Arg.Compat.Any<Ticket>()).ReturnsForAnyArgs("");
        betListService.GetBetTypeNameNewChineseSimplified(Arg.Compat.Any<Ticket>()).ReturnsForAnyArgs("");
        betListService.GetBetTypeNameChineseSimplified(Arg.Compat.Any<Ticket>()).ReturnsForAnyArgs("");
        var pagingService = Substitute.For<PagingService>();
        pagingService.Paging(data, request.PageIndex, request.PageSize)
            .ReturnsForAnyArgs(new List<GetTicketModel>());
        var handler = new GetTicketsHandler(pagingService, getTicketsService, matchService, sessionService,
            mapTicketService, updateListTicketsViewModelService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Null(actual.Id);
    }

    [Fact]
    public async Task GetTickets_HaveTickets_ReturnGroup()
    {
        // Arrange
        var request = new GetTicketsRequest();
        var listGroup = new List<Group<GetTicketModel>>
            {
                new()
                {
                    Tickets = new List<GetTicketModel> { new() }
                }
            };
        var data = new List<GetTicketModel>
            {
                new()
                {
                    TransDate = new DateTime(2018, 10, 31, 10, 10, 10, 111), GroupName = string.Empty, BetdaqId = 2,
                    IsMixParlay = false
                },
                new()
                {
                    TransDate = new DateTime(2018, 10, 31, 9, 10, 10, 111), GroupName = string.Empty, IsMixParlay = true
                },
                new()
                {
                    TransDate = new DateTime(2018, 10, 30, 16, 20, 20, 222), GroupName = string.Empty
                },
                new()
                {
                    TransDate = new DateTime(2018, 10, 30, 16, 20, 20, 222), GroupName = string.Empty,
                    IsInstantSettlement = true, IsDeposit = true
                },
                new()
                {
                    TransDate = new DateTime(2018, 10, 30, 16, 20, 20, 222), GroupName = string.Empty, IsCashOut = true,
                    IsDeposit = true
                }
            };
        var getTicketsService = Substitute.For<GetTicketsService>();
        var matchService = Substitute.For<MatchService>();
        var sessionService = Substitute.For<SessionService>();
        var mapTicketService = Substitute.For<MapTicketService>();
        var updateListTicketsViewModelService = Substitute.For<UpdateListTicketsViewModelService>();
        getTicketsService.GetTickets(request).ReturnsForAnyArgs(data);
        var betListService = Substitute.For<BetListService>();
        mapTicketService.MapToTicketViewModel(default, default, default).ReturnsForAnyArgs(new TicketViewModel());
        betListService.GetBetTypeName(Arg.Compat.Any<Ticket>()).ReturnsForAnyArgs("");
        betListService.GetBetTypeNameChineseTraditional(Arg.Compat.Any<Ticket>()).ReturnsForAnyArgs("");
        betListService.GetBetTypeNameNewChineseSimplified(Arg.Compat.Any<Ticket>()).ReturnsForAnyArgs("");
        betListService.GetBetTypeNameChineseSimplified(Arg.Compat.Any<Ticket>()).ReturnsForAnyArgs("");
        var pagingService = Substitute.For<PagingService>();
        pagingService.Paging(data, request.PageIndex, request.PageSize)
            .ReturnsForAnyArgs(new List<GetTicketModel> { new() });
        pagingService.Groups(data, ticket => ticket.GroupName).ReturnsForAnyArgs(listGroup);
        var handler = new GetTicketsHandler(pagingService, getTicketsService, matchService, sessionService,
            mapTicketService, updateListTicketsViewModelService);

        // Act
        var model = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotEmpty(model.Groups);
    }

    [Fact]
    public async Task GetTickets_HaveTicketsInDepositGroups_UpdateLicenseeList()
    {
        // Arrange
        var request = new GetTicketsRequest();
        var listGroup = new List<Group<GetTicketModel>>
            {
                new()
                {
                    Tickets = new List<GetTicketModel> { new() }
                }
            };
        var data = new List<GetTicketModel>
            {
                new() { LicenseeName = "A", GroupName = "Credit", IsMixParlay = true },
                new() { LicenseeName = "A", GroupName = "Credit", IsDeposit = true },
                new() { LicenseeName = "B", GroupName = "Deposit", IsDeposit = true },
                new() { LicenseeName = "C", GroupName = "8RM/BARM", IsDeposit = true },
                new() { LicenseeName = "D", GroupName = "Deposit (Instant Settlement)", IsDeposit = true }
            };
        var getTicketsService = Substitute.For<GetTicketsService>();
        var matchService = Substitute.For<MatchService>();
        var sessionService = Substitute.For<SessionService>();
        var mapTicketService = Substitute.For<MapTicketService>();
        var updateListTicketsViewModelService = Substitute.For<UpdateListTicketsViewModelService>();
        getTicketsService.GetTickets(request).ReturnsForAnyArgs(data);
        var betListService = Substitute.For<BetListService>();
        mapTicketService.MapToTicketViewModel(default, default, default).ReturnsForAnyArgs(new TicketViewModel());
        betListService.GetBetTypeName(Arg.Compat.Any<Ticket>()).ReturnsForAnyArgs("");
        betListService.GetBetTypeNameChineseTraditional(Arg.Compat.Any<Ticket>()).ReturnsForAnyArgs("");
        betListService.GetBetTypeNameNewChineseSimplified(Arg.Compat.Any<Ticket>()).ReturnsForAnyArgs("");
        betListService.GetBetTypeNameChineseSimplified(Arg.Compat.Any<Ticket>()).ReturnsForAnyArgs("");
        var pagingService = Substitute.For<PagingService>();
        pagingService.Paging(data, request.PageIndex, request.PageSize)
            .ReturnsForAnyArgs(new List<GetTicketModel> { new() });
        pagingService.Groups(data, ticket => ticket.GroupName).ReturnsForAnyArgs(listGroup);
        var handler = new GetTicketsHandler(pagingService, getTicketsService, matchService, sessionService,
            mapTicketService, updateListTicketsViewModelService);

        // Act
        var model = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotEmpty(model.Groups);
    }
    */
}