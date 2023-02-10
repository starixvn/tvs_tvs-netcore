using NSubstitute;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.ExportExcel;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Services.ExportExcel;

public class GetDetailTicketsWorkSheetServiceTests
{
    [Theory]
    [InlineData(11)]
    [InlineData(0)]
    public async Task BindingContent_Always_CreateTitle(int matchId)
    {
        // Arrange
        var worksheet = TestSetup.CreateTestingSheet();
        var model = new GetDetailTicketsQuery { MatchId = matchId };
        var cellService = Substitute.For<CellService>();
        var getTicketsService = Substitute.For<GetTicketsService>();
        var service = new GetDetailTicketsWorkSheetService(cellService, getTicketsService);

        // Act
        await service.BindingContent(worksheet, model);

        // Assert
        cellService.Received(1).CreateTitle(matchId);
        await getTicketsService.Received(1).GetDetailTicketsForExportExcel(Arg.Any<GetDetailTicketsQuery>());
    }
}