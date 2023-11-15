using System.Drawing;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using TicketVoidingSystem.ManageRequest.Constants;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.ExportExcel;

public interface CellService
{
    void SetStyle(ExcelWorksheet worksheet);
}

public class CellServiceImp : CellService
{
    public void SetStyle(ExcelWorksheet worksheet)
    {
        worksheet.Cells.Style.WrapText = true;
        var lastRow = worksheet.Dimension.End.Row;
        HighlightForRemark(worksheet, lastRow);
        HighlightBackground(worksheet, lastRow);
        const int fontSize = 8;
        worksheet.Cells.Style.Font.Size = fontSize;
        worksheet.Cells.Style.Font.Name = "Tahoma";
        worksheet.Cells[$"A2:T{lastRow}"].Style.Border.Top.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[$"A2:T{lastRow}"].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[$"A2:T{lastRow}"].Style.Border.Right.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[$"A2:T{lastRow}"].Style.Border.Left.Style = ExcelBorderStyle.Thin;
    }

    private static void HighlightBackground(ExcelWorksheet worksheet, int lastRow)
    {
        const int two = 2;
        for (var row = 2; row <= lastRow; row += two)
        {
            var range = worksheet.Cells[$"A{row}:T{row}"];
            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(Color.LemonChiffon);
        }
    }

    private static void HighlightForRemark(ExcelWorksheet worksheet, int lastRow)
    {
        var conditionColorMap = new Dictionary<string, Color>
        {
            { $"R2=\"{RemarkConstant.InvalidTicket}\"", Color.Red },
            { $"R2=\"{RemarkConstant.SettledTicket}\"", Color.Red },
            { $"R2=\"{RemarkConstant.UnsupportedTicket}\"", Color.Red },
            { $"R2=\"{RemarkConstant.ExistingOnOtherRequest}\"", Color.Red },
            { $"R2=\"{RemarkConstant.NonLiveTicket}\"", Color.Red },
            { $"R2=\"{RemarkConstant.DifferentLiveScore}\"", Color.Red },
            { $"R2=\"{RemarkConstant.AbWhiteListTransIds}\"", Color.Red },
            { $"R2=\"{RemarkConstant.MovedOrDuplicatedTicket}\"", Color.Orange },
            { $"R2=\"{RemarkConstant.DifferentMatch}\"", Color.DeepSkyBlue }
        };

        foreach (var entry in conditionColorMap)
        {
            worksheet.HighlightBackground($"R2:R{lastRow}", entry.Key, entry.Value);
        }

        var listRemarkHighlightColorRed = new List<string>
        {
            RemarkConstant.InvalidTicket, RemarkConstant.SettledTicket,
            RemarkConstant.UnsupportedTicket, RemarkConstant.ExistingOnOtherRequest, RemarkConstant.NonLiveTicket,
            RemarkConstant.DifferentLiveScore, RemarkConstant.AbWhiteListTransIds
        };

        for (var row = 2; row <= lastRow; row ++)
        {
            if (!listRemarkHighlightColorRed.Contains(worksheet.Cells[$"R{row}:R{row}"].Value))
            {
                continue;
            }

            var range = worksheet.Cells[$"R{row}:R{row}"];
            range.Style.Font.Color.SetColor(Color.Yellow);
        }
    }
}