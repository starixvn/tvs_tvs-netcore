using System.Drawing;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.MarkTickets.Services.ExportExcel;

public interface CellService
{
    string CreateTitle(int matchId);

    void AddMatch(ExcelWorksheet worksheet, Match match);

    void SetStyle(ExcelWorksheet worksheet);
}

public class CellServiceImp : CellService
{
    public string CreateTitle(int matchId)
    {
        return $"Mark/ Unmark tickets - MatchId: {matchId}";
    }

    public void AddMatch(ExcelWorksheet worksheet, Match match)
    {
        const int row = 5;
        const int matchCodeCol = 1;
        const int eventTimeCol = 4;
        const int matchEventCol = 2;
        var eventTime = match.EventDate.ToString(FormatKey.ShortDateFormatWithSlash);
        worksheet.Cells[row, matchCodeCol].Value = match.MatchCode;
        worksheet.Cells[row, matchEventCol].Value = match.MatchEvent;
        worksheet.Cells[row, eventTimeCol].Value = eventTime;
    }

    public void SetStyle(ExcelWorksheet worksheet)
    {
        worksheet.Cells.Style.WrapText = true;
        var lastRow = worksheet.Dimension.End.Row;
        worksheet.HighlightBackground($"A8:J{lastRow}", "MOD(ROW(),2)>0", Color.LemonChiffon);
        worksheet.HighlightFont($"F8:F{lastRow}", "LEFT(F8,1)=\"-\"", Color.Red);
    }
}