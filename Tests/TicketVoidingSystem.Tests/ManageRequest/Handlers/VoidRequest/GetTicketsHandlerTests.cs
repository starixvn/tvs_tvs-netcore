using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.VoidRequest;

public class GetTicketsHandlerTests
{
    private readonly CheckPermissionOnRequestService checkPermissionOnRequestService;
    private readonly GetTicketsService getTicketsService;
    private readonly GetTicketsHandler handler;
    private readonly MapTicketsService mapTicketsService;
    private readonly PagingService pagingService;

    public GetTicketsHandlerTests()
    {
        getTicketsService = Substitute.For<GetTicketsService>();
        mapTicketsService = Substitute.For<MapTicketsService>();
        pagingService = Substitute.For<PagingService>();
        var ticketsViewModelService = Substitute.For<TicketsViewModelService>();
        checkPermissionOnRequestService = Substitute.For<CheckPermissionOnRequestService>();
        handler = new GetTicketsHandler(getTicketsService, mapTicketsService, pagingService, ticketsViewModelService,
            checkPermissionOnRequestService);
    }

    [Theory]
    [InlineData(0, "Parlay")]
    [InlineData(1, "1")]
    public async Task GetTickets_HaveTicketsDisplay_ReturnTicketsViewModel(int matchId, string groupName)
    {
        // Arrange
        var request = new GetTicketsRequest { Match = new Match { MatchId = matchId } };
        var listGroup = new List<Group<GetTicketModel>>
        {
            new()
            {   Name = groupName,
                Tickets = new List<GetTicketModel> { new() }
            }
        };
        var data = new List<GetTicketModel>();
        checkPermissionOnRequestService.GetVoidPermission().ReturnsForAnyArgs(new VoidPermission());
        getTicketsService.GetTickets(request).ReturnsForAnyArgs(data);
        mapTicketsService.MapToGroupTicketViewModel(Arg.Any<GroupTicketsMappingParameters>())
            .ReturnsForAnyArgs(new Group<TicketViewModel>());
        pagingService.Paging(data, default, default).ReturnsForAnyArgs(new List<GetTicketModel> { new() });
        pagingService.Groups(data, ticket => ticket.GroupName).ReturnsForAnyArgs(listGroup);
        var expected = new TicketsViewModel
        {
            Groups = new List<Group<TicketViewModel>> { new() }
        };

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task GetTickets_HaveMatchIsNull_ReturnTicketsViewModel()
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
        var data = new List<GetTicketModel>();
        checkPermissionOnRequestService.GetVoidPermission().ReturnsForAnyArgs(new VoidPermission());
        getTicketsService.GetTickets(request).ReturnsForAnyArgs(data);
        mapTicketsService.MapToGroupTicketViewModel(Arg.Any<GroupTicketsMappingParameters>())
            .ReturnsForAnyArgs(new Group<TicketViewModel>());
        pagingService.Paging(data, default, default).ReturnsForAnyArgs(new List<GetTicketModel> { new() });
        pagingService.Groups(data, ticket => ticket.GroupName).ReturnsForAnyArgs(listGroup);
        var expected = new TicketsViewModel
        {
            Groups = new List<Group<TicketViewModel>> { new() }
        };

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public void GetTickets_GenerateGroup_ReturnEmpty()
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
        var data = new List<GetTicketModel>();
        checkPermissionOnRequestService.GetVoidPermission().ReturnsForAnyArgs(new VoidPermission());
        getTicketsService.GetTickets(request).ReturnsForAnyArgs(data);
        mapTicketsService.MapToGroupTicketViewModel(Arg.Any<GroupTicketsMappingParameters>())
            .ReturnsForAnyArgs(new Group<TicketViewModel>());
        pagingService.Paging(data, default, default).ReturnsForAnyArgs(new List<GetTicketModel>());
        pagingService.Groups(data, ticket => ticket.GroupName).ReturnsForAnyArgs(listGroup);

        // Act
        var actual = handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(actual);
    }
}