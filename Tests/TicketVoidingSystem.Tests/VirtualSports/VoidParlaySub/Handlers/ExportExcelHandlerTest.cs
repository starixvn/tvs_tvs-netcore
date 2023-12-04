using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VirtualSports.VoidParlaySub.Handlers;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.Excel;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.VoidParlaySub.Handlers;


public class ExportExcelHandlerTest
{
    [Fact]
    public async Task CreateStreamFile_Always_GetVoidParlayVirtualSportsBetTemplate()
    {
        // Arrange
        var request = new ExportExcelRequest();
        var excelService = Substitute.For<ExcelService<ExportExcelQuery>>();
        var handler = new ExportExcelHandler(excelService);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await excelService.Received().GenerateContentAsByteArray(request, TemplateExcelPath.VoidParlayVirtualSportsBet);
    }

    [Fact]
    public async Task Export_SetDateTimeNow_ReturnFileNameWithDateTime()
    {
        // Arrange
        var request = new ExportExcelRequest { MatchId = 123 };
        var excelService = Substitute.For<ExcelService<ExportExcelQuery>>();
        var handler = new ExportExcelHandler(excelService);

        // Act
        var model = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Contains("Void_Parlay_Virtual_Sports_Bet", model.FileName);
    }
}