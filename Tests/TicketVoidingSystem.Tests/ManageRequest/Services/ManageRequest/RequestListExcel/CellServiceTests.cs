using System.Collections.Generic;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.RequestListExcel;

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
        const int lastRow = 10;
        const int lasCol = 5;
        worksheet.Cells[lastRow, lasCol].Value = "1";
        var requests = new List<ExcelRequestModel>
        {
            new()
            {
                RequestId = 1,
                NumberOfRequestDetails = 2,
                Index = 1
            }
        };

        // Act
        cellService.RenderDataWorksheet(worksheet, requests);

        // Assert
        Assert.Equal(1, worksheet.Cells[2, 1].GetValue<int>());
    }

    [Fact]
    public void RenderDataWorksheet_CheckIsHighlightBackground_SetDataCorrectly()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        const int lastRow = 10;
        const int lasCol = 5;
        worksheet.Cells[lastRow, lasCol].Value = "1";
        var requests = new List<ExcelRequestModel>
        {
            new()
            {
                RequestId = 1,
                NumberOfRequestDetails = null,
                Index = null
            },
            new()
            {
                RequestId = 1,
                NumberOfRequestDetails = null,
                Index = 1
            },
            new()
            {
                RequestId = 1,
                NumberOfRequestDetails = null,
                Index = 2
            },
            new()
            {
                RequestId = 1,
                NumberOfRequestDetails = 1,
                Index = 2
            },
            new()
            {
                RequestId = 1,
                NumberOfRequestDetails = 1,
                Index = 3
            }
        };

        // Act
        cellService.RenderDataWorksheet(worksheet, requests);

        // Assert
        Assert.Equal(1, worksheet.Cells[2, 1].GetValue<int>());
    }
}