using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Services;
using TicketVoidingSystem.TicketListing.Services.ExportExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketListing.Services.ExportExcel;

public class GetTicketsWorkSheetServiceTests
{
    [Fact]
    public async Task BindingContent_Always_SetStyle()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var model = new ExportExcelQuery { MatchId = 132 };
        var cellService = Substitute.For<CellService>();
        var getTicketsService = Substitute.For<GetTicketsService>();
        var control = new GetTicketsWorkSheetService(cellService, getTicketsService);

        // Act
        await control.BindingContent(worksheet, model);

        // Assert
        cellService.Received(1).CreateTitle(Arg.Any<ExportExcelQuery>());
        await getTicketsService.Received(1).GetTicketsForExportExcel(Arg.Any<ExportExcelQuery>());
    }
}