using System.Drawing;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
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
            if (!query.IsGroup)
            {
                title += " - " + StringResource.Bettype + ": " + query.BetTypeName;
            }
        }
        else
        {
            title += " - " + StringResource.Bettype + ": " + query.BetTypeName;
            if (!query.IsGroup)
            {
                title += " - " + StringResource.Licensee + ": " + query.LicenseeName;
            }
        }

        return title;
    }

    public void AddMatch(ExcelWorksheet worksheet, ExportExcelQuery query)
    {
        var eventDate = query.EventDate.ToString(FormatKey.ShortDateFormatWithSlash);
        const int MatchRow = 5;
        const int MatchCodeColumn = 1;
        const int MatchEventColumn = 2;
        const int EventTimeColumn = 4;

        if (query.Product == GameType.BitCoin)
        {
            var eventTime = $"{query.StartTime.ToString(FormatKey.OnlyTimeFormat)} - {query.EndTime.ToString(FormatKey.OnlyTimeFormat)}";
            worksheet.Cells[MatchRow, MatchCodeColumn].Value = query.MatchId;
            worksheet.Cells[MatchRow, MatchEventColumn].Value = eventTime;
        }
        else
        {
            worksheet.Cells[MatchRow, MatchCodeColumn].Value = query.MatchCode;
            worksheet.Cells[MatchRow, MatchEventColumn].Value = query.MatchEvent;
        }
        worksheet.Cells[MatchRow, EventTimeColumn].Value = eventDate;
    }

    public void SetStyle(ExcelWorksheet worksheet, bool isNumberGame)
    {
        worksheet.Cells.Style.WrapText = true;
        var lastRow = worksheet.Dimension.End.Row;
        worksheet.HighlightFont($"E8:E{lastRow}", "LEFT(E8,1)=\"-\"", Color.Red);
        worksheet.HighlightFont($"G8:G{lastRow}", "G8 < 0", Color.Red);
        if (isNumberGame)
        {
            worksheet.HighlightBackground($"A8:L{lastRow}", "MOD(ROW(),2)>0", Color.LemonChiffon);
        }
        else
        {
            const int DeleteColumn = 10;
            worksheet.DeleteColumn(DeleteColumn);
            worksheet.HighlightBackground($"A8:K{lastRow}", "MOD(ROW(),2)>0", Color.LemonChiffon);
        }
    }
}