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

public class SheetServiceImp(
    GetTicketsService getTicketsService,
    TicketService ticketHtmlService)
    : SheetService
{
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
                TransDate = ticketDetail.TransDate,

                Member = ticketDetail.Member.LineBreak(),
                BetType = ticketDetail.BetType.LineBreak(),
                Odds = ticketDetail.Odds.DefaultText(),
                Stake = ticketDetail.Stake.StakeText(),
                WinLoss = ticketDetail.WinLoss.LineBreak(),
                Currency = ticketDetail.Currency.DefaultText(),
                Status = ticketDetail.Status.DefaultText(),
                Sa = item.SecAcceptFlag ? "√" : string.Empty,
                Score = ticketDetail.Score.DefaultText(),
                Handicap = ticketDetail.Handicap.DefaultText(),
                Choice = ticketDetail.Choice
            };

            excelTickets.Add(ticket);
        }

        return excelTickets;
    }

    public void SetStyle(ExcelWorksheet worksheet)
    {
        const int startRow = 5;
        var lastRow = worksheet.Cells["A:A"].Where(c => c.Value != null).Max(c => c.Start.Row);

        worksheet.Cells.Style.WrapText = true;
        worksheet.Cells[$"A{startRow}:N{lastRow}"].Style.Font.Name = "Tahoma";
        worksheet.Cells[$"A{startRow}:N{lastRow}"].Style.Font.Size = 8;
        worksheet.Cells[$"A{startRow}:N{lastRow}"].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[$"A{startRow}:A{lastRow}"].Style.Border.Left.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[$"A{startRow}:N{lastRow}"].Style.Border.Right.Style = ExcelBorderStyle.Thin;
        worksheet.HighlightFont($"H5:H{lastRow}", "LEFT(H5,1)=\"-\"", Color.Red);
        worksheet.HighlightFont($"F5:F{lastRow}", "LEFT(F5,1)=\"-\"", Color.Red);

        HighlightBackground(worksheet, startRow, lastRow);
    }

    private static void HighlightBackground(ExcelWorksheet worksheet, int startRow, int lastRow)
    {
        const int two = 2;
        for (var row = startRow + 1; row <= lastRow; row += two)
        {
            var range = worksheet.Cells[$"A{row}:N{row}"];
            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(Color.LemonChiffon);
        }
    }
}