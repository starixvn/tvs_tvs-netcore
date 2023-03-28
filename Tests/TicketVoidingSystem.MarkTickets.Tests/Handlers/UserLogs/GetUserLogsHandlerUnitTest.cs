using NSubstitute;
using TicketVoidingSystem.MarkTickets.Handlers.UserLogs;
using TicketVoidingSystem.MarkTickets.Models.UserLogs;
using TicketVoidingSystem.MarkTickets.Services.UserLogs;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Handlers.UserLogs;

public class GetUserLogsHandlerUnitTest
{
    [Fact]
    public async Task GetUserLogs_HaveLogs_TotalUserLogsHavePagging()
    {
        // Arrange
        var request = new GetUserLogsRequest();
        var uerLogViewModels = new List<GetUserLogViewModel> {
            new () { MatchId = 12345 },
            new () { MatchId = 12323 },
            new () { MatchId = 12543 }
        };

        var userLogsService = Substitute.For<UserLogsService>();
        userLogsService.GetUserLogs(default).ReturnsForAnyArgs(new List<GetUserLogModel>());
        userLogsService.CreateUserLogViewModels(default).ReturnsForAnyArgs(uerLogViewModels);
        var pagingService = Substitute.For<PagingService>();
        pagingService.Paging(uerLogViewModels, request.PageIndex, request.PageSize).ReturnsForAnyArgs(uerLogViewModels);
        var handler = new GetUserLogsHandler(userLogsService, pagingService);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(uerLogViewModels.Count, result.LogList.Count());
    }
}