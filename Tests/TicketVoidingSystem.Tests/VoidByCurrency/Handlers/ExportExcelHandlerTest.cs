using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Handlers;
using SpecialDelete.VoidByCurrency.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.Excel;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Handlers;


public class ExportExcelHandlerTest
{
    [Fact]
    public async Task Export_ValidRequest_CallCreateStreamFromExcelService()
    {
        // Arrange
        var request = new ExportExcelRequest { MatchId = 456 };
        var excelService = Substitute.For<ExcelService<GetTicketsQuery>>();
        var handler = new ExportExcelHandler(excelService);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await excelService.Received().GenerateContentAsByteArray(request, TemplateExcelPath.VoidByCurrency);
    }

    [Fact]
    public async Task Export_SetDateTimeNow_ReturnContentFile()
    {
        // Arrange
        var request = new ExportExcelRequest { MatchId = 123456 };
        var expectedContentFile = new byte[] { 1, 2, 3 };
        var excelService = Substitute.For<ExcelService<GetTicketsQuery>>();
        excelService.GenerateContentAsByteArray(Arg.Any<GetTicketsQuery>(), Arg.Any<string>())
            .ReturnsForAnyArgs(expectedContentFile);
        var handler = new ExportExcelHandler(excelService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expectedContentFile, actual.ContentAsByteArray);
    }
}