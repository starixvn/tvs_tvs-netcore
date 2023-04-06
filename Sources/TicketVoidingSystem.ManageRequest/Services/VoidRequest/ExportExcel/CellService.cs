using System.Drawing;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest.ExportExcel;

public interface CellService
{
    string CreateTitle(int matchId);

    void AddMatch(ExcelWorksheet worksheet, Match match);

    void WriteGroupHeader(ExcelWorksheet worksheet, int rowNumber, string groupName, int numberOfTickets);

    void SetStyle(ExcelWorksheet worksheet, bool isHasMatch);
}

public class CellServiceImp : CellService
{
    public string CreateTitle(int matchId)
    {
        return $"Void Bet - MatchId: {matchId}";
    }

    public void AddMatch(ExcelWorksheet worksheet, Match match)
    {
        var eventTime = match.EventDate.ToString(FormatKey.ShortDateFormatWithSlash);
        worksheet.Cells[5, 1].Value = match.MatchCode;
        worksheet.Cells[5, 2].Value = match.LeagueName;
        worksheet.Cells[5, 3].Value = match.MatchEvent;
        worksheet.Cells[5, 4].Value = eventTime;
    }

    public void WriteGroupHeader(ExcelWorksheet worksheet, int rowNumber, string groupName, int numberOfTickets)
    {
        var headerRange = worksheet.Cells[$"A{rowNumber}:M{rowNumber}"];
        headerRange.Merge = true;
        const int FontSize = 8;
        headerRange.Style.Font.Size = FontSize;
        headerRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
        headerRange.Style.Fill.BackgroundColor.SetColor(Color.LightGray);
        headerRange.Style.Font.Bold = true;
        headerRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
        headerRange.Style.Font.Name = "Tahoma";
        headerRange.Value = $"{groupName} ({numberOfTickets})";
    }

    public void SetStyle(ExcelWorksheet worksheet, bool isHasMatch)
    {
        var startRow = isHasMatch ? 8 : 6;
        worksheet.Cells.Style.WrapText = true;
        var lastRow = worksheet.Dimension.End.Row;
        worksheet.HighlightFont($"F{startRow}:F{lastRow}", $"LEFT(F{startRow},1)=\"-\"", Color.Red);
        worksheet.HighlightBackground($"A{startRow}:M{lastRow}", "MOD(ROW(),2)>0", Color.LemonChiffon);
    }
}