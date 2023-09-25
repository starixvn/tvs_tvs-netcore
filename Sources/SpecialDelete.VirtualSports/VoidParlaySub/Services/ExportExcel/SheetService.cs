using System.Drawing;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using SpecialDelete.VirtualSports.Common.Services;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.GetTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Services.ExportExcel;

public interface SheetService
{
    Task<IEnumerable<ExcelTicketModel>> GetTickets(ExportExcelQuery query);

    void SetStyle(ExcelWorksheet worksheet);

    void EditMatch(ExcelWorksheet worksheet, ExportExcelQuery query);
}

public class SheetServiceImp : SheetService
{
    private readonly GetTicketsService getTicketsService;
    private readonly TicketService ticketService;

    public SheetServiceImp(
        GetTicketsService getTicketsService,
        TicketService ticketService)
    {
        this.getTicketsService = getTicketsService;
        this.ticketService = ticketService;
    }

    public async Task<IEnumerable<ExcelTicketModel>> GetTickets(ExportExcelQuery query)
    {
        var tickets = new List<ExcelTicketModel>();
        var model = await getTicketsService.ExecuteQuery(query);
        var index = 1;
        foreach (var item in model.Tickets)
        {
            var ticketHtml = ticketService.GetTicket(item);
            var ticket = new ExcelTicketModel
            {
                No = index++,
                BetId = item.TransId.ToString(),
                Member = item.UserName,
                TransDate = ticketHtml.TransDate,
                Odds = ticketHtml.Odds.DefaultText(),
                Stake = ticketHtml.Stake.StakeText(),
                Status = ticketHtml.Status.DefaultText(),
                WinLoss = ticketHtml.WinLoss.DefaultText(),
                Choice = HtmlExtension.ChoiceParlay(ticketHtml.Choice)
            };
            tickets.Add(ticket);
        }

        return tickets;
    }

    public void SetStyle(ExcelWorksheet worksheet)
    {
        worksheet.Cells.Style.WrapText = true;
        var lastRow = worksheet.Dimension.End.Row;
        worksheet.HighlightBackground($"A8:I{lastRow}", "MOD(ROW(),2)>0", Color.LemonChiffon);
        worksheet.HighlightFont($"E8:E{lastRow}", "LEFT(E8,1)=\"-\"", Color.Red);
        worksheet.HighlightFont($"G8:G{lastRow}", "LEFT(G8,1)=\"-\"", Color.Red);
    }

    public void EditMatch(ExcelWorksheet worksheet, ExportExcelQuery query)
    {
        if (query.MatchId <= 0)
        {
            return;
        }

        const int row = 5;
        const int matchCodeCol = 1;
        const int matchEventCol = 2;
        const int eventTimeCol = 4;
        var eventTime = query.EventDate.ToString(FormatKey.ShortDateFormatWithSlash);
        worksheet.Cells[row, matchCodeCol].Value = query.MatchCode;
        worksheet.Cells[row, matchEventCol].Value = query.MatchEvent;
        worksheet.Cells[row, eventTimeCol].Value = eventTime;
    }
}