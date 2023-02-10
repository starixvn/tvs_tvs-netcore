using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.Services.Excel;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Handlers.MarkUnmarkTickets;

public class ExportExcelHandlerTests
{
    [Fact]
    public async Task ExportExcel_ValidRequest_CallExcelServiceCreateStream()
    {
        // Arrange
        var request = new ExportExcelRequest { MatchId = 456 };
        var excelService = Substitute.For<ExcelService<GetTicketsQuery>>();
        var handler = new ExportExcelHandler(excelService);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        await excelService.Received().CreateFileAsByteArray(request, TemplateExcelPath.MarkUnmarkTickets);
        Assert.NotNull(result);
    }
}