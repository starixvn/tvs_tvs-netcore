using System.Drawing;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRemark.RemarkListExcel;

public interface CellService
{
    void SetStyle(ExcelWorksheet worksheet);

    void RenderDataWorksheet(ExcelWorksheet worksheet, IEnumerable<ExcelRemarkModel> remarks);
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

        worksheet.Cells[$"A2:Y{lastRow}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        worksheet.Cells[$"AA2:AE{lastRow}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        worksheet.Cells[$"A2:AE{lastRow}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
        worksheet.Cells[$"Z2:Z{lastRow}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
    }

    public void RenderDataWorksheet(ExcelWorksheet worksheet, IEnumerable<ExcelRemarkModel> remarks)  // NOSONAR
    {
        var index = 2;

        foreach (var remark in remarks)
        {
            worksheet.Cells[index, 1].Value = remark.EventDateMatch;
            worksheet.Cells[index, 2].Value = remark.KickOffTimeMatch;
            worksheet.Cells[index, 3].Value = remark.League;
            worksheet.Cells[index, 4].Value = remark.Event;
            worksheet.Cells[index, 5].Value = remark.Trader;
            worksheet.Cells[index, 6].Value = remark.LA;
            worksheet.Cells[index, 7].Value = remark.Remark;
            worksheet.Cells[index, 8].Value = remark.TVAndIPTV;
            worksheet.Cells[index, 9].Value = remark.Provider;
            worksheet.Cells[index, 10].Value = remark.Source;
            worksheet.Cells[index, 11].Value = remark.VarCheck;
            worksheet.Cells[index, 12].Value = remark.Action;
            worksheet.Cells[index, 13].Value = remark.MistakenBy;
            worksheet.Cells[index, 14].Value = remark.CreatedBy;
            worksheet.Cells[index, 15].Value = remark.PerformedBy;
            worksheet.Cells[index, 16].Value = remark.DecidedBy;
            worksheet.Cells[index, 18].Value = remark.Message;
            worksheet.Cells[index, 19].Value = remark.CloseCaseBy;
            worksheet.Cells[index, 21].Value = remark.Sport;
            worksheet.Cells[index, 24].Value = remark.MatchId;
            worksheet.Cells[index, 25].Value = remark.CalculatedScore;
            worksheet.Cells[index, 26].Value = remark.Description;
            worksheet.Cells[index, 29].Value = remark.CreatedTime;

            if ((index - 2) % 2 == 0)
            {
                HighlightBackground(worksheet, index, index);
            }

            index++;
        }
    }

    private static void HighlightBackground(ExcelWorksheet worksheet, int rowStart, int rowEnd)
    {
        worksheet.Cells[$"A{rowStart}:AE{rowEnd}"].Style.Fill.PatternType = ExcelFillStyle.Solid;
        worksheet.Cells[$"A{rowStart}:AE{rowEnd}"].Style.Fill.BackgroundColor.SetColor(Color.LemonChiffon);
    }
}