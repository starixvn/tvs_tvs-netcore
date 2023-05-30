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
        const int matchRow = 5;
        const int matchCodeColumn = 1;
        const int leagueNameColumn = 2;
        const int eventTimeColumn = 4;
        const int matchEventColumn = 3;

        var eventTime = match.EventDate.ToString(FormatKey.ShortDateFormatWithSlash);
        worksheet.Cells[matchRow, matchCodeColumn].Value = match.MatchCode;
        worksheet.Cells[matchRow, leagueNameColumn].Value = match.LeagueName;
        worksheet.Cells[matchRow, eventTimeColumn].Value = eventTime;
        worksheet.Cells[matchRow, matchEventColumn].Value = match.MatchEvent;
    }

    public string CreateTitle(int matchId)
    {
        return $"Void Bet - MatchId: {matchId}";
    }

    public void WriteGroupHeader(ExcelWorksheet worksheet, int rowNumber, Group<ExcelVoidedTicketModel> group)
    {
        const int fontSize = 8;
        var headerRange = worksheet.Cells[$"A{rowNumber}:O{rowNumber}"];
        headerRange.Merge = true;
        headerRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
        headerRange.Style.Fill.BackgroundColor.SetColor(Color.LightGray);
        headerRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Font.Name = "Tahoma";
        headerRange.Style.Font.Size = fontSize;
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