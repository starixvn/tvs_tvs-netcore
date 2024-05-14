using System.Drawing;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.GetTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.VoidByBetId.Services.ExportExcel;

public interface SheetService
{
    Task<IEnumerable<ExcelTicketModel>> GetTickets(GetTicketsQuery query);

    void SetStyle(ExcelWorksheet worksheet);
}

public class SheetServiceImp : SheetService
{
    private readonly GetTicketsService getTicketsService;
    private readonly TicketService ticketHtmlService;

    public SheetServiceImp(
        GetTicketsService getTicketsService,
        TicketService ticketHtmlService)
    {
        this.getTicketsService = getTicketsService;
        this.ticketHtmlService = ticketHtmlService;
    }

    public async Task<IEnumerable<ExcelTicketModel>> GetTickets(GetTicketsQuery query)
    {
        var excelTickets = new List<ExcelTicketModel>();
        var getTicketsResult = await getTicketsService.GetTickets(query);
        var index = 1;
        foreach (var item in getTicketsResult.Tickets)
        {
            var ticketDetail = ticketHtmlService.GetTicket(item, ChoiceType.Excel);
            var ticket = new ExcelTicketModel
            {
                No = index++,
                BetId = ticketDetail.BetId.LineBreak(),
                Member = ticketDetail.Player.LineBreak(),
                Date = ticketDetail.TransDate,
                Choice = ticketDetail.Choice,
                Odds = ticketDetail.Odds.DefaultText(),
                Stake = ticketDetail.Stake.StakeText(),
                Status = ticketDetail.Status.DefaultText(),
                WinLoss = ticketDetail.WinLost.LineBreak()
            };

            excelTickets.Add(ticket);
        }

        return excelTickets;
    }

    public void SetStyle(ExcelWorksheet worksheet)
    {
        var lastRow = worksheet.Dimension.End.Row;
        worksheet.HighlightFont($"H5:H{lastRow}", "LEFT(H5,1)=\"-\"", Color.Red);
        worksheet.HighlightFont($"F5:F{lastRow}", "LEFT(F5,1)=\"-\"", Color.Red);
        worksheet.Cells.Style.WrapText = true;
        HighlightBackground(worksheet, lastRow);
    }

    private static void HighlightBackground(ExcelWorksheet worksheet, int lastRow)
    {
        const int two = 2;
        const int startRow = 5;
        for (var row = startRow; row <= lastRow; row += two)
        {
            var range = worksheet.Cells[$"A{row}:I{row}"];
            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(Color.LemonChiffon);
        }
    }
}