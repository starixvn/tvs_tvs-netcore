using NSubstitute;
using TicketVoidingSystem.MarkTickets.Handlers.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Handlers.ConfirmAutoUnmark;

public class GetDataForConfirmAutoUnmarkHandlerTests
{
    [Fact]
    public async Task GetAutoUnmarkTickets_HaveTickets_TotalMarkedTicketsHavePaging()
    {
        // Arrange
        var request = new GetDataForConfirmAutoUnmarkRequest();
        var data = new List<ConfirmAutoUnmarkModel>
        {
            new () { MatchId = 12345, HomeId = 1, AwayId = 6, MarkedTrans = 10 },
            new () { MatchId = 12323, HomeId = 2, AwayId = 4, MarkedTrans = 11 },
            new () { MatchId = 12543, HomeId = 3, AwayId = 5, MarkedTrans = 12 },
            new () { MatchId = 12543, HomeId = 3, AwayId = 5, MarkedTrans = 12, BetId = "1"},
        };

        var confirmAutoUnmarkService = Substitute.For<ConfirmAutoUnmarkService>();
        confirmAutoUnmarkService.GetDataForConfirmAutoUnmark(default).ReturnsForAnyArgs(data);
        var pagingService = Substitute.For<PagingService>();
        pagingService.Paging(data, request.PageIndex, request.PageSize).ReturnsForAnyArgs(data);
        var mapDataService = Substitute.For<MapDataForConfirmAutoUnmarkService>();
        mapDataService.MapToConfirmAutoUnmarkViewModels(default).ReturnsForAnyArgs(new List<ConfirmAutoUnmarkViewModel>());
        var handler = new GetDataForConfirmAutoUnmarkHandler(confirmAutoUnmarkService, pagingService, mapDataService);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        mapDataService.Received(1).MapToConfirmAutoUnmarkViewModels(Arg.Any<IEnumerable<ConfirmAutoUnmarkModel>>());
        Assert.NotNull(result);
    }
}