using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.NumberGame.Handlers;
using SpecialDelete.NumberGame.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.Excel;
using Xunit;

namespace TicketVoidingSystem.Tests.NumberGame.Handlers;


public class ExportExcelHandlerTest
{
    [Fact]
    public async Task ExportExcel_CreateStream_PassEarlyKickOffTemplate()
    {
        // Arrange
        var request = new ExportExcelRequest { MatchId = 456 };
        var excelService = Substitute.For<ExcelService<GetVoidTicketsQuery>>();
        var handler = new ExportExcelHandler(excelService);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await excelService.Received().GenerateContentAsByteArray(request, TemplateExcelPath.VoidNumberGameBet);
    }

    [Fact]
    public async Task Export_SetDateTimeNow_ReturnFileNameWithDateTime()
    {
        // Arrange
        var request = new ExportExcelRequest();
        var excelService = Substitute.For<ExcelService<GetVoidTicketsQuery>>();
        var handler = new ExportExcelHandler(excelService);

        // Act
        var model = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Contains("Void_Number_Game_Tickets_", model.FileName);
    }
}