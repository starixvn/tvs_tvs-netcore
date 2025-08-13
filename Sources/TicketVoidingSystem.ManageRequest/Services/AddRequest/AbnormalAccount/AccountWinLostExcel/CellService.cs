using System.Drawing;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using TicketVoidingSystem.ManageRequest.Constants;

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
        worksheet.Cells[Number.Two, Number.One, lastRow, lasCol].Style.Border.Top.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[Number.Two, Number.One, lastRow, lasCol].Style.Border.Left.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[Number.Two, Number.One, lastRow, lasCol].Style.Border.Right.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[Number.Two, Number.One, lastRow, lasCol].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
        worksheet.Cells.Style.Font.Size = Number.Eight;
        worksheet.Cells.Style.Font.Name = "Tahoma";
        worksheet.Cells.Style.WrapText = true;
    }

    public void RenderDataWorksheet(ExcelWorksheet worksheet, IEnumerable<AccountWinlostExcelModel> models)
    {
        var index = Number.Two;
        foreach (var model in models)
        {
            worksheet.Cells[index, Number.One].Value = model.No;
            worksheet.Cells[index, Number.Two].Value = model.Username;
            worksheet.Cells[index, Number.Three].Value = CheckNumberOrDecimal(model.GivenCredit);
            worksheet.Cells[index, Number.Four].Value = CheckNumberOrDecimal(model.AdjustVoidLimit);
            worksheet.Cells[index, Number.Five].Value = CheckNumberOrDecimal(model.CurrentLosing);
            worksheet.Cells[index, Number.Six].Value = CheckNumberOrDecimal(model.CurrentWinning);
            worksheet.Cells[index, Number.Seven].Value = CheckNumberOrDecimal(model.EstimateVoidAmount);
            worksheet.Cells[index, Number.Eight].Value = CheckNumberOrDecimal(model.WinLostAfterVoid);

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
        worksheet.Cells[$"A{rowStart}:H{rowEnd}"].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#F6BA92"));
    }
}