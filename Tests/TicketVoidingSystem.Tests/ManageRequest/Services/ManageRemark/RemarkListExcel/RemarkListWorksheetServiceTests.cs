using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark.RemarkListExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRemark.RemarkListExcel;

public class RemarkListWorksheetServiceTests
{
    private readonly GetRemarksForExcelService getRemarksForExcelService;
    private readonly CellService cellService;
    private readonly RemarkListWorksheetService service;

    public RemarkListWorksheetServiceTests()
    {
        getRemarksForExcelService = Substitute.For<GetRemarksForExcelService>();
        cellService = Substitute.For<CellService>();
        service = new RemarkListWorksheetService(getRemarksForExcelService, cellService);
    }

    [Fact]
    public async Task BindingContent_ValidQuery_CallsGetRemarksExcelAndRenderData()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var query = new SelectRemarksQuery { RemarkId = 1 };
        var excelRemarks = new List<ExcelRemarkModel>
        {
            new() { MatchId = "1", EventDateMatch = "2024-01-01" }
        };
        getRemarksForExcelService.GetRemarksExcel(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(excelRemarks);

        // Act
        await service.BindingContent(worksheet, query);

        // Assert
        await getRemarksForExcelService.Received(1).GetRemarksExcel(query);
        cellService.Received(1).RenderDataWorksheet(worksheet, excelRemarks);
        cellService.Received(1).SetStyle(worksheet);
    }

    [Fact]
    public async Task BindingContent_EmptyRemarks_CallsAllMethods()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var query = new SelectRemarksQuery { MatchId = 1 };
        var emptyRemarks = new List<ExcelRemarkModel>();
        getRemarksForExcelService.GetRemarksExcel(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(emptyRemarks);

        // Act
        await service.BindingContent(worksheet, query);

        // Assert
        await getRemarksForExcelService.Received(1).GetRemarksExcel(query);
        cellService.Received(1).RenderDataWorksheet(worksheet, emptyRemarks);
        cellService.Received(1).SetStyle(worksheet);
    }

    [Fact]
    public async Task BindingContent_MultipleRemarks_CallsRenderDataWithAllRemarks()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var query = new SelectRemarksQuery { RemarkId = 1 };
        var excelRemarks = new List<ExcelRemarkModel>
        {
            new() { MatchId = "1", EventDateMatch = "2024-01-01" },
            new() { MatchId = "2", EventDateMatch = "2024-01-02" },
            new() { MatchId = "3", EventDateMatch = "2024-01-03" }
        };
        getRemarksForExcelService.GetRemarksExcel(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(excelRemarks);

        // Act
        await service.BindingContent(worksheet, query);

        // Assert
        await getRemarksForExcelService.Received(1).GetRemarksExcel(query);
        cellService.Received(1).RenderDataWorksheet(worksheet, Arg.Is<IEnumerable<ExcelRemarkModel>>(r =>
            System.Linq.Enumerable.Count(r) == 3));
        cellService.Received(1).SetStyle(worksheet);
    }
}