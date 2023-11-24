using System.Threading.Tasks;
using NSubstitute;
using OfficeOpenXml;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.ExportExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.ExportExcel;

public class GetTicketsForExportExcelServiceTests
{
    private readonly CellService cellService;
    private readonly GetTicketsForExportExcelService service;

    public GetTicketsForExportExcelServiceTests()
    {
        cellService = Substitute.For<CellService>();
        service = new GetTicketsForExportExcelService(cellService);
    }

    [Fact]
    public async Task BindingContent_WithMatchNotNull_HasGetGroupsExcelTickets()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var model = new ExportTicketAbnormalBetQuery { Tickets = new[] { new AbnormalBetTicketViewModel() } };

        // Act
        await service.BindingContent(worksheet, model);

        // Assert
        cellService.Received(1).SetStyle(Arg.Any<ExcelWorksheet>());
    }
}