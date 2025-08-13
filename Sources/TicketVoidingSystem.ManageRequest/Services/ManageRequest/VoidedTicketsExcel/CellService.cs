using System.Drawing;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;

public interface CellService
{
    string CreateTitle(int matchId, int issueTypeId);

    void AddMatch(ExcelWorksheet worksheet, Match? match);

    void WriteGroupHeader(ExcelWorksheet worksheet, int rowNumber, Group<ExcelVoidedTicketModel> group);

    void SetStyle(ExcelWorksheet worksheet, int issueTypeId);
}

public class CellServiceImp : CellService
{
    public void AddMatch(ExcelWorksheet worksheet, Match? match)
    {
        if (match == null)
        {
            return;
        }

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

    public string CreateTitle(int matchId, int issueTypeId)
    {
        return issueTypeId != IssueTypeConstant.RecoverTicket ? $"Void Bet - MatchId: {matchId}" : "Recover Bet";
    }

    public void WriteGroupHeader(ExcelWorksheet worksheet, int rowNumber, Group<ExcelVoidedTicketModel> group)
    {
        var headerRange = worksheet.Cells[$"A{rowNumber}:O{rowNumber}"];
        headerRange.Merge = true;
        headerRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
        headerRange.Style.Fill.BackgroundColor.SetColor(Color.LightGray);
        headerRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
        headerRange.Style.Font.Bold = true;
        headerRange.Value = $"{group.Name} ({group.Tickets.Count()})";
    }

    public void SetStyle(ExcelWorksheet worksheet, int issueTypeId)
    {
        const int fontSize = 8;
        var startRow = issueTypeId != IssueTypeConstant.RecoverTicket ? 8 : 5;
        worksheet.Cells.Style.WrapText = true;
        var lastRow = worksheet.Dimension.End.Row;
        worksheet.Cells[$"A{startRow}:O{lastRow}"].Style.Font.Name = "Tahoma";
        worksheet.Cells[$"A{startRow}:O{lastRow}"].Style.Font.Size = fontSize;
        worksheet.Cells[$"A{startRow}:O{lastRow}"].Style.Border.Top.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[$"A{startRow}:O{lastRow}"].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[$"A{startRow}:O{lastRow}"].Style.Border.Right.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[$"A{startRow}:O{lastRow}"].Style.Border.Left.Style = ExcelBorderStyle.Thin;
        worksheet.HighlightFont($"F{startRow}:F{lastRow}", $"LEFT(F{startRow},1)=\"-\"", Color.Red);
        HighlightBackground(worksheet, startRow, lastRow);
    }

    private static void HighlightBackground(ExcelWorksheet worksheet, int startRow, int lastRow)
    {
        const int two = 2;
        for (var row = startRow + 1; row <= lastRow; row += two)
        {
            var range = worksheet.Cells[$"A{row}:O{row}"];
            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(Color.LemonChiffon);
        }
    }
}