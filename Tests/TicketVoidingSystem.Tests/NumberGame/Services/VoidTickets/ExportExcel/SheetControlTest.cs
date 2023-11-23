using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.Services.VoidTickets.ExportExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.NumberGame.Services.VoidTickets.ExportExcel;

public class SheetControlTest
{
    [Fact]
    public async Task Binding_Always_SetStyle()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var query = new GetVoidTicketsQuery { MatchId = 111 };
        var sheetService = Substitute.For<SheetService>();
        sheetService.GetTickets(query).ReturnsForAnyArgs(new List<ExcelTicketModel>());
        var control = new SheetControlImp(sheetService);

        // Act
        await control.BindingContent(worksheet, query);

        // Assert
        sheetService.Received().SetStyle(worksheet);
    }
}