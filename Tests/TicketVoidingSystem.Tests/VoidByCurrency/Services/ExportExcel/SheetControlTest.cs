using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Services.ExportExcel;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Services.ExportExcel;

public class SheetControlTest
{
    [Fact]
    public async Task BindingContent_Always_SetStyle()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var model = new GetTicketsQuery { MatchId = 123 };
        var sheetService = Substitute.For<SheetService>();
        sheetService.GetTickets(model).ReturnsForAnyArgs(new List<ExcelTicketModel>());
        var matchService = Substitute.For<MatchService>();
        matchService.GetMatchVoidByCurrency(null).ReturnsForAnyArgs(new Match());
        matchService.UpdateMatchInfoFromRemotingRef(null).ReturnsForAnyArgs(new Match());
        var control = new SheetControlImp(sheetService, matchService);

        // Act
        await control.BindingContent(worksheet, model);

        // Assert
        sheetService.Received().SetStyle(worksheet);
    }
}