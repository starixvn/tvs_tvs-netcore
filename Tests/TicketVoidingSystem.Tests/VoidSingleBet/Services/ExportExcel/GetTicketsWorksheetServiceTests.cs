using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.ExportExcel;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Services.ExportExcel;

public class GetTicketsWorksheetServiceTests
{
    [Fact]
    public async Task BindingAsync_Always_SetStyle()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var model = new GetTicketsQuery { MatchId = 111, OddsValue = "1"};
        var cellService = Substitute.For<CellService>();
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTicketsForExportExcel(model).ReturnsForAnyArgs(new List<ExcelTicketModel>());
        var control = new GetTicketsWorksheetService(getTicketsService, cellService);

        // Act
        await control.BindingContent(worksheet, model);

        // Assert
        cellService.Received().SetStyle(worksheet);
    }
}