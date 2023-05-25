using System.Drawing;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;

public interface CellService
{
    string CreateTitle(int matchId);

    void AddMatch(ExcelWorksheet worksheet, Match match);

    void WriteGroupHeader(ExcelWorksheet worksheet, int rowNumber, Group<ExcelVoidedTicketModel> group);

    void SetStyle(ExcelWorksheet worksheet);
}

public class CellServiceImp : CellService
{
    public void AddMatch(ExcelWorksheet worksheet, Match match)
    {
        var eventTime = match.EventDate.ToString(FormatKey.ShortDateFormatWithSlash);
        worksheet.Cells[5, 1].Value = match.MatchCode;
        worksheet.Cells[5, 2].Value = match.LeagueName;
        worksheet.Cells[5, 4].Value = eventTime;
        worksheet.Cells[5, 3].Value = match.MatchEvent;
    }

    public string CreateTitle(int matchId)
    {
        return $"Void Bet - MatchId: {matchId}";
    }

    public void WriteGroupHeader(ExcelWorksheet worksheet, int rowNumber, Group<ExcelVoidedTicketModel> group)
    {
        var headerRange = worksheet.Cells[$"A{rowNumber}:O{rowNumber}"];
        headerRange.Merge = true;
        headerRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
        headerRange.Style.Fill.BackgroundColor.SetColor(Color.LightGray);
        headerRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Font.Name = "Tahoma";
        headerRange.Style.Font.Size = 8;
        headerRange.Value = $"{group.Name} ({group.Tickets.Count()})";
    }

    public void SetStyle(ExcelWorksheet worksheet)
    {
        worksheet.Cells.Style.WrapText = true;
        var lastRow = worksheet.Dimension.End.Row;
        worksheet.HighlightBackground($"A8:O{lastRow}", "MOD(ROW(),2)>0", Color.LemonChiffon);
        worksheet.HighlightFont($"F8:F{lastRow}", "LEFT(F8,1)=\"-\"", Color.Red);
    }
}