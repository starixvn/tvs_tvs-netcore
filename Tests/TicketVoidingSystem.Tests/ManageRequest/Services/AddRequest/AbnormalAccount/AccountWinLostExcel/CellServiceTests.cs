using System.Collections.Generic;
using OfficeOpenXml.Style;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.AccountWinLostExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalAccount.AccountWinLostExcel;

public class CellServiceTests
{
    private readonly CellServiceImp cellService = new();

    [Fact]
    public void SetStyle_SetsWorksheetStyleCorrectly()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        worksheet.Cells[10, 5].Value = "1";

        // Act
        cellService.SetStyle(worksheet);

        // Assert
        Assert.Equal(8, worksheet.Cells[1, 1].Style.Font.Size);
        Assert.Equal("Tahoma", worksheet.Cells[1, 1].Style.Font.Name);
    }

    [Fact]
    public void RenderDataWorksheet_HasRequests_SetDataCorrectly()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var models = new List<AccountWinlostExcelModel>
        {
            new()
            {
                No = 1,
                Username = "1",
                CurrentLosing = 1,
                IsHighlight = false
            }
        };

        // Act
        cellService.RenderDataWorksheet(worksheet, models);

        // Assert
        Assert.Equal(1, worksheet.Cells[2, 1].GetValue<int>());
    }

    [Fact]
    public void RenderDataWorksheet_IsHighlightBG_SetPatternType()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var models = new List<AccountWinlostExcelModel>
        {
            new()
            {
                No = 1,
                Username = "1",
                CurrentLosing = 1,
                IsHighlight = true
            }
        };

        // Act
        cellService.RenderDataWorksheet(worksheet, models);

        // Assert
        Assert.Equal(1, worksheet.Cells[2, 1].GetValue<int>());
        Assert.Equal(ExcelFillStyle.Solid, worksheet.Cells[2, 1].Style.Fill.PatternType);
    }
}