using System.Collections.Generic;
using OfficeOpenXml.Style;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark.RemarkListExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRemark.RemarkListExcel;

public class CellServiceTests
{
    private readonly CellServiceImp service;

    public CellServiceTests()
    {
        service = new CellServiceImp();
    }

    [Fact]
    public void SetStyle_ValidWorksheet_SetsBorderStyles()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        worksheet.Cells[2, 1].Value = "Test";
        worksheet.Cells[3, 1].Value = "Test2";
        worksheet.Cells[2, 2].Value = "Test3";

        // Act
        service.SetStyle(worksheet);

        // Assert
        var lastRow = worksheet.Dimension.End.Row;
        var lastCol = worksheet.Dimension.End.Column;
        Assert.Equal(ExcelBorderStyle.Thin, worksheet.Cells[2, 1, lastRow, lastCol].Style.Border.Top.Style);
        Assert.Equal(ExcelBorderStyle.Thin, worksheet.Cells[2, 1, lastRow, lastCol].Style.Border.Left.Style);
        Assert.Equal(ExcelBorderStyle.Thin, worksheet.Cells[2, 1, lastRow, lastCol].Style.Border.Right.Style);
        Assert.Equal(ExcelBorderStyle.Thin, worksheet.Cells[2, 1, lastRow, lastCol].Style.Border.Bottom.Style);
    }

    [Fact]
    public void SetStyle_ValidWorksheet_SetsFontProperties()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        worksheet.Cells[2, 1].Value = "Test";

        // Act
        service.SetStyle(worksheet);

        // Assert
        Assert.Equal(8, worksheet.Cells.Style.Font.Size);
        Assert.Equal("Tahoma", worksheet.Cells.Style.Font.Name);
        Assert.True(worksheet.Cells.Style.WrapText);
    }

    [Fact]
    public void SetStyle_ValidWorksheet_SetsAlignment()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        worksheet.Cells[2, 1].Value = "Test";
        worksheet.Cells[3, 1].Value = "Test2";

        // Act
        service.SetStyle(worksheet);

        // Assert
        var lastRow = worksheet.Dimension.End.Row;
        Assert.Equal(ExcelHorizontalAlignment.Center, worksheet.Cells[$"A2:Y{lastRow}"].Style.HorizontalAlignment);
        Assert.Equal(ExcelHorizontalAlignment.Center, worksheet.Cells[$"AA2:AE{lastRow}"].Style.HorizontalAlignment);
        Assert.Equal(ExcelVerticalAlignment.Center, worksheet.Cells[$"A2:AE{lastRow}"].Style.VerticalAlignment);
        Assert.Equal(ExcelHorizontalAlignment.Left, worksheet.Cells[$"Z2:Z{lastRow}"].Style.HorizontalAlignment);
    }

    [Fact]
    public void RenderDataWorksheet_EmptyRemarks_DoesNotThrow()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var remarks = new List<ExcelRemarkModel>();

        // Act & Assert
        service.RenderDataWorksheet(worksheet, remarks);
        Assert.NotNull(worksheet);
    }

    [Fact]
    public void RenderDataWorksheet_SingleRemark_RendersAllFields()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var remark = new ExcelRemarkModel
        {
            EventDateMatch = "2024-01-01",
            KickOffTimeMatch = "10:00 AM",
            League = "Premier League",
            Event = "Team A vs Team B",
            Trader = "Trader1",
            LA = "LA1",
            Remark = "Test Remark",
            TVAndIPTV = "IPTV",
            Provider = "Provider1",
            Source = "Source1",
            VarCheck = "Yes",
            Action = "Refund",
            MistakenBy = "User1",
            CreatedBy = "User2",
            PerformedBy = "User3",
            DecidedBy = "User4",
            Message = "Test Message",
            CloseCaseBy = "User5",
            Sport = "Football",
            MatchId = "123",
            CalculatedScore = "2-1",
            Description = "Test Description",
            CreatedTime = "2024-01-01 10:00:00"
        };
        var remarks = new List<ExcelRemarkModel> { remark };

        // Act
        service.RenderDataWorksheet(worksheet, remarks);

        // Assert
        Assert.Equal(remark.EventDateMatch, worksheet.Cells[2, 1].Value);
        Assert.Equal(remark.KickOffTimeMatch, worksheet.Cells[2, 2].Value);
        Assert.Equal(remark.League, worksheet.Cells[2, 3].Value);
        Assert.Equal(remark.Event, worksheet.Cells[2, 4].Value);
        Assert.Equal(remark.Trader, worksheet.Cells[2, 5].Value);
        Assert.Equal(remark.LA, worksheet.Cells[2, 6].Value);
        Assert.Equal(remark.Remark, worksheet.Cells[2, 7].Value);
        Assert.Equal(remark.TVAndIPTV, worksheet.Cells[2, 8].Value);
        Assert.Equal(remark.Provider, worksheet.Cells[2, 9].Value);
        Assert.Equal(remark.Source, worksheet.Cells[2, 10].Value);
        Assert.Equal(remark.VarCheck, worksheet.Cells[2, 11].Value);
        Assert.Equal(remark.Action, worksheet.Cells[2, 12].Value);
        Assert.Equal(remark.MistakenBy, worksheet.Cells[2, 13].Value);
        Assert.Equal(remark.CreatedBy, worksheet.Cells[2, 14].Value);
        Assert.Equal(remark.PerformedBy, worksheet.Cells[2, 15].Value);
        Assert.Equal(remark.DecidedBy, worksheet.Cells[2, 16].Value);
        Assert.Equal(remark.Message, worksheet.Cells[2, 18].Value);
        Assert.Equal(remark.CloseCaseBy, worksheet.Cells[2, 19].Value);
        Assert.Equal(remark.Sport, worksheet.Cells[2, 21].Value);
        Assert.Equal(remark.MatchId, worksheet.Cells[2, 24].Value);
        Assert.Equal(remark.CalculatedScore, worksheet.Cells[2, 25].Value);
        Assert.Equal(remark.Description, worksheet.Cells[2, 26].Value);
        Assert.Equal(remark.CreatedTime, worksheet.Cells[2, 29].Value);
    }

    [Fact]
    public void RenderDataWorksheet_MultipleRemarks_RendersAllRows()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var remarks = new List<ExcelRemarkModel>
        {
            new() { MatchId = "1", EventDateMatch = "2024-01-01" },
            new() { MatchId = "2", EventDateMatch = "2024-01-02" },
            new() { MatchId = "3", EventDateMatch = "2024-01-03" }
        };

        // Act
        service.RenderDataWorksheet(worksheet, remarks);

        // Assert
        Assert.Equal("1", worksheet.Cells[2, 24].Value);
        Assert.Equal("2", worksheet.Cells[3, 24].Value);
        Assert.Equal("3", worksheet.Cells[4, 24].Value);
    }

    [Fact]
    public void RenderDataWorksheet_EvenIndexedRows_HighlightsBackground()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var remarks = new List<ExcelRemarkModel>
        {
            new() { MatchId = "1", EventDateMatch = "2024-01-01" },
            new() { MatchId = "2", EventDateMatch = "2024-01-02" },
            new() { MatchId = "3", EventDateMatch = "2024-01-03" },
            new() { MatchId = "4", EventDateMatch = "2024-01-04" }
        };

        // Act
        service.RenderDataWorksheet(worksheet, remarks);

        // Assert
        // Row 2 (index 0) should be highlighted
        Assert.Equal(ExcelFillStyle.Solid, worksheet.Cells["A2:AE2"].Style.Fill.PatternType);
        // Row 4 (index 2) should be highlighted
        Assert.Equal(ExcelFillStyle.Solid, worksheet.Cells["A4:AE4"].Style.Fill.PatternType);
    }
}