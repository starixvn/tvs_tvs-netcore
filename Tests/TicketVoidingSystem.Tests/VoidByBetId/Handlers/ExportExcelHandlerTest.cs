using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VoidByBetId.Handlers;
using SpecialDelete.VoidByBetId.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.Excel;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Handlers;

[Category("VoidByBetId")]
public class ExportExcelHandlerTest
{
    [Fact]
    public async Task Export_ValidRequest_CallExcelServiceCreateStream()
    {
        // Arrange
        var request = new ExportExcelRequest();
        var excelService = Substitute.For<ExcelService<GetTicketsQuery>>();
        var handler = new ExportExcelHandler(excelService);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await excelService.Received().GenerateContentAsByteArray(request, TemplateExcelPath.VoidByBetId);
    }

    [Fact]
    public async Task Export_SetDateTimeNow_ReturnFileNameWithDateTime()
    {
        // Arrange
        var request = new ExportExcelRequest();
        var excelService = Substitute.For<ExcelService<GetTicketsQuery>>();
        var handler = new ExportExcelHandler(excelService);

        // Act
        var model = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Contains("Void_By_Bet_ID", model.FileName);
    }
}