using System.Drawing;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.AccountWinLostExcel;

public interface CellService
{
    void SetStyle(ExcelWorksheet worksheet);

    void RenderDataWorksheet(ExcelWorksheet worksheet, IEnumerable<AccountWinlostExcelModel> models);
}

public class CellServiceImp : CellService
{
    public void SetStyle(ExcelWorksheet worksheet)
    {
        var lastRow = worksheet.Dimension.End.Row;
        var lasCol = worksheet.Dimension.End.Column;
        worksheet.Cells[2, 1, lastRow, lasCol].Style.Border.Top.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[2, 1, lastRow, lasCol].Style.Border.Left.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[2, 1, lastRow, lasCol].Style.Border.Right.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[2, 1, lastRow, lasCol].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
        worksheet.Cells.Style.Font.Size = 8;
        worksheet.Cells.Style.Font.Name = "Tahoma";
        worksheet.Cells.Style.WrapText = true;
    }

    public void RenderDataWorksheet(ExcelWorksheet worksheet, IEnumerable<AccountWinlostExcelModel> models)
    {
        var index = 2;
        foreach (var model in models)
        {
            worksheet.Cells[index, 1].Value = model.No;
            worksheet.Cells[index, 2].Value = model.Username;
            worksheet.Cells[index, 3].Value = model.GivenCredit;
            worksheet.Cells[index, 4].Value = model.AdjustVoidLimit;
            worksheet.Cells[index, 5].Value = model.CurrentLosing;
            worksheet.Cells[index, 6].Value = model.CurrentWinning;
            worksheet.Cells[index, 7].Value = model.EstimateVoidAmount;
            worksheet.Cells[index, 8].Value = model.WinLostAfterVoid;

            if (model.IsHighlight)
            {
                HighlightBackground(worksheet, index, index);
            }

            index++;
        }
    }

    private static void HighlightBackground(ExcelWorksheet worksheet, int rowStart, int rowEnd)
    {
        worksheet.Cells[$"A{rowStart}:H{rowEnd}"].Style.Fill.PatternType = ExcelFillStyle.Solid;
        worksheet.Cells[$"A{rowStart}:H{rowEnd}"].Style.Fill.BackgroundColor.SetColor(Color.LemonChiffon);
    }
}