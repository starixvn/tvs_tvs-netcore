using System.Drawing;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using TicketVoidingSystem.ManageRequest.Constants;
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
        worksheet.Cells[NumberConstant.Two, NumberConstant.One, lastRow, lasCol].Style.Border.Top.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[NumberConstant.Two, NumberConstant.One, lastRow, lasCol].Style.Border.Left.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[NumberConstant.Two, NumberConstant.One, lastRow, lasCol].Style.Border.Right.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[NumberConstant.Two, NumberConstant.One, lastRow, lasCol].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
        worksheet.Cells.Style.Font.Size = NumberConstant.Eight;
        worksheet.Cells.Style.Font.Name = "Tahoma";
        worksheet.Cells.Style.WrapText = true;
    }

    public void RenderDataWorksheet(ExcelWorksheet worksheet, IEnumerable<AccountWinlostExcelModel> models)
    {
        var index = NumberConstant.Two;
        foreach (var model in models)
        {
            worksheet.Cells[index, NumberConstant.One].Value = model.No;
            worksheet.Cells[index, NumberConstant.Two].Value = model.Username;
            worksheet.Cells[index, NumberConstant.Three].Value = CheckNumberOrDecimal(model.GivenCredit);
            worksheet.Cells[index, NumberConstant.Four].Value = CheckNumberOrDecimal(model.AdjustVoidLimit);
            worksheet.Cells[index, NumberConstant.Five].Value = CheckNumberOrDecimal(model.CurrentLosing);
            worksheet.Cells[index, NumberConstant.Six].Value = CheckNumberOrDecimal(model.CurrentWinning);
            worksheet.Cells[index, NumberConstant.Seven].Value = CheckNumberOrDecimal(model.EstimateVoidAmount);
            worksheet.Cells[index, NumberConstant.Eight].Value = CheckNumberOrDecimal(model.WinLostAfterVoid);

            if (model.IsHighlight)
            {
                HighlightBackground(worksheet, index, index);
            }

            index++;
        }
    }

    private static string CheckNumberOrDecimal(decimal? value)
    {
        return value % 1 == 0 ? $"{value:N0}" : $"{value:#,0.####}";
    }

    private static void HighlightBackground(ExcelWorksheet worksheet, int rowStart, int rowEnd)
    {
        worksheet.Cells[$"A{rowStart}:H{rowEnd}"].Style.Fill.PatternType = ExcelFillStyle.Solid;
        worksheet.Cells[$"A{rowStart}:H{rowEnd}"].Style.Fill.BackgroundColor.SetColor(Color.LemonChiffon);
    }
}