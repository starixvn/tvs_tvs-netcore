using System;
using System.Drawing;
using BetListNPOI.SS.Formula.Functions;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.TicketListing.Constants;
using TicketVoidingSystem.TicketListing.Criteria;

namespace TicketVoidingSystem.TicketListing.Services.ExportExcel;

public interface CellService
{
    string CreateTitle(ExportExcelQuery query);

    void AddMatch(ExcelWorksheet worksheet, ExportExcelQuery query);

    void SetStyle(ExcelWorksheet worksheet, bool isNumberGame);
}

public class CellServiceImp : CellService
{
    public string CreateTitle(ExportExcelQuery query)
    {
        var title = StringResource.Tickets_Listing_for_MatchID_Bettype + query.MatchId;
        if (query.GroupBy == GroupByConstants.Licensees)
        {
            title += " - " + StringResource.Licensee + ": " + query.LicenseeName;
            return !query.IsGroup ? title + " - " + StringResource.Bettype + ": " + query.BetTypeName : title;
        }

        title += " - " + StringResource.Bettype + ": " + query.BetTypeName;
        return !query.IsGroup ? title + " - " + StringResource.Licensee + ": " + query.LicenseeName : title;
    }

    public void AddMatch(ExcelWorksheet worksheet, ExportExcelQuery query)
    {
        var eventDate = query.EventDate.ToString(FormatKey.ShortDateFormatWithSlash);
        const int matchRow = 5;
        const int matchCodeColumn = 1;
        const int matchEventColumn = 2;
        const int eventTimeColumn = 4;

        if (query.Product == GameType.BitCoin)
        {
            var eventTime = $"{query.StartTime.ToString(FormatKey.OnlyTimeFormat)} - {query.EndTime.ToString(FormatKey.OnlyTimeFormat)}";
            worksheet.Cells[matchRow, matchCodeColumn].Value = query.MatchId;
            worksheet.Cells[matchRow, matchEventColumn].Value = eventTime;
        }
        else
        {
            worksheet.Cells[matchRow, matchCodeColumn].Value = query.MatchCode;
            worksheet.Cells[matchRow, matchEventColumn].Value = query.MatchEvent;
        }

        worksheet.Cells[matchRow, eventTimeColumn].Value = eventDate;
    }

    public void SetStyle(ExcelWorksheet worksheet, bool isNumberGame)
    {
        worksheet.Cells.Style.WrapText = true;
        var lastRow = worksheet.Dimension.End.Row;
        worksheet.HighlightFont($"E8:E{lastRow}", "LEFT(E8,1)=\"-\"", Color.Red);
        worksheet.HighlightFont($"G8:G{lastRow}", "G8 < 0", Color.Red);
        HighlightBackground(worksheet, lastRow, isNumberGame);
    }

    private static void HighlightBackground(ExcelWorksheet worksheet, int lastRow, bool isNumberGame)
    {
        if (!isNumberGame)
        {
            const int deleteColumn = 10;
            worksheet.DeleteColumn(deleteColumn);
        }
        const int two = 2;
        for (var row = 9; row <= lastRow; row += two)
        {
            var range = isNumberGame ? worksheet.Cells[$"A{row}:L{row}"] : worksheet.Cells[$"A{row}:K{row}"];
            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(Color.LemonChiffon);
        }
    }

}