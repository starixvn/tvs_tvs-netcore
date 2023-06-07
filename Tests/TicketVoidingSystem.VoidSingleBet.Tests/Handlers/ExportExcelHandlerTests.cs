using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Handlers;
using Xunit;

namespace TicketVoidingSystem.VoidSingleBet.Tests.Handlers;

public class ExportExcelHandlerTests
{
    [Fact]
    public async Task Export_ValidRequest_CallExcelServiceCreateStream()
    {
        // Arrange
        var request = new ExportExcelRequest { MatchId = 456 };
        var excelService = Substitute.For<ExcelService<GetTicketsQuery>>();
        var handler = new ExportExcelHandler(excelService);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await excelService.Received().GenerateContentAsByteArray(request, TemplateExcelPath.VoidSingleBet);
    }

    [Fact]
    public async Task Export_SetDateTimeNow_ReturnFileNameWithDateTime()
    {
        // Arrange
        var request = new ExportExcelRequest { MatchId = 456 };
        var excelService = Substitute.For<ExcelService<GetTicketsQuery>>();
        var handler = new ExportExcelHandler(excelService);

        // Act
        var model = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(model.FileName);
    }
}