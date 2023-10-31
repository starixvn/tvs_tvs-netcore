using System.Drawing;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
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
        worksheet.HighlightBackground($"A5:I{lastRow}", "MOD(ROW(),2)>0", Color.LemonChiffon);
        worksheet.HighlightFont($"F5:F{lastRow}", "LEFT(F5,1)=\"-\"", Color.Red);
        worksheet.Cells.Style.WrapText = true;
    }
}