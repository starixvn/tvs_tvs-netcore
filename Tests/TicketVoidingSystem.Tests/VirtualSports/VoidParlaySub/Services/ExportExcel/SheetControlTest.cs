using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.ExportExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.VoidParlaySub.Services.ExportExcel;

public class SheetControlTest
{
    [Fact]
    public async Task BindingSheet_Always_CallSetStyle()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var model = new ExportExcelQuery { MatchId = 123 };
        var sheetService = Substitute.For<SheetService>();
        sheetService.GetTickets(new ExportExcelQuery()).
            ReturnsForAnyArgs(new List<ExcelTicketModel>());
        var control = new SheetControlImp(sheetService);

        // Act
        await control.BindingContent(worksheet, model);

        // Assert
        sheetService.Received().SetStyle(worksheet);
    }
}