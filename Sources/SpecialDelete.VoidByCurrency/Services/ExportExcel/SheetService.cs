using System.Drawing;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Services.GetTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;

namespace SpecialDelete.VoidByCurrency.Services.ExportExcel;

public interface SheetService
{
    void AddTitle(ExcelWorksheet worksheet, int matchId);

    void AddMatch(ExcelWorksheet worksheet, Match? match);

    Task<IEnumerable<ExcelTicketModel>> GetTickets(GetTicketsQuery query);

    void SetStyle(ExcelWorksheet worksheet);
}

public class SheetServiceImp : SheetService
{
    private readonly GetTicketsService getTicketsService;
    private readonly TicketService ticketHtmlService;
    private readonly ConvertService convertService;

    public SheetServiceImp(
        GetTicketsService getTicketsService,
        TicketService ticketHtmlService,
        ConvertService convertService)
    {
        this.getTicketsService = getTicketsService;
        this.ticketHtmlService = ticketHtmlService;
        this.convertService = convertService;
    }

    public void AddTitle(ExcelWorksheet worksheet, int matchId)
    {
        worksheet.Cells[1, 1].Value = $"Void By Currency - MatchId: {matchId}";
    }

    public void AddMatch(ExcelWorksheet worksheet, Match? match)
    {
        if (match != null)
        {
            const int matchCodeCol = 1;
            const int row = 5;
            const int matchEventCol = 2;
            const int eventTimeCol = 4;

            var eventTime = match.EventDate.ToString(FormatKey.ShortDateFormatWithSlash);
            worksheet.Cells[row, matchCodeCol].Value = match.MatchCode;
            worksheet.Cells[row, matchEventCol].Value = match.MatchEvent;
            worksheet.Cells[row, eventTimeCol].Value = eventTime;
        }
    }

    public async Task<IEnumerable<ExcelTicketModel>> GetTickets(GetTicketsQuery query)
    {
        var data = await getTicketsService.GetTickets(query);
        var tickets = new List<ExcelTicketModel>();
        var index = 1;
        foreach (var item in data)
        {
            var ticketHtml = ticketHtmlService.GetTicketDetail(item, query.IsOutright);
            var ticket = new ExcelTicketModel
            {
                No = index++,
                BetId = item.TransId.ToString(),
                Member = item.UserName,
                TransDate = ticketHtml.TransDate,
                Odds = ticketHtml.Odds.DefaultText(),
                Stake = ticketHtml.Stake.StakeText(),
                WinLoss = ticketHtml.WinLoss,
                Currency = item.CurrencyCode,
                Status = ticketHtml.Status.DefaultText(),
                Sa = item.IsSecondAcceptFlag ? "√" : string.Empty,
                Choice = convertService.Choice(ticketHtml.Choice)
            };

            tickets.Add(ticket);
        }

        return tickets;
    }

    public void SetStyle(ExcelWorksheet worksheet)
    {
        worksheet.Cells.Style.WrapText = true;
        var lastRow = worksheet.Dimension.End.Row;
        worksheet.HighlightBackground($"A8:K{lastRow}", "MOD(ROW(),2)>0", Color.LemonChiffon);
        worksheet.HighlightFont($"E8:E{lastRow}", "LEFT(E8,1)=\"-\"", Color.Red);
        worksheet.HighlightFont($"G8:G{lastRow}", "LEFT(G8,1)=\"-\"", Color.Red);
    }
}