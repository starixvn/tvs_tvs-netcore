using System.Drawing;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using SpecialDelete.CashOutTransaction.CancelCashOut.Criteria;
using SpecialDelete.CashOutTransaction.CancelCashOut.Models;
using SpecialDelete.CashOutTransaction.Common.Extensions;
using SpecialDelete.CashOutTransaction.Common.Models;
using SpecialDelete.CashOutTransaction.Common.Repositories;
using SpecialDelete.CashOutTransaction.Common.Services;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.CashOutTransaction.CancelCashOut.Services.ExportExcel;

public interface SheetService
{
    List<ExcelTicketModel> GetTickets(GetTicketsQuery query);

    void SetStyle(ExcelWorksheet worksheet);
}

public class SheetServiceImp : SheetService
{
    private readonly Repository repository;
    private readonly TicketHtmlService ticketHtmlService;

    public SheetServiceImp(
        Repository repository,
        TicketHtmlService ticketHtmlService)
    {
        this.repository = repository;
        this.ticketHtmlService = ticketHtmlService;
    }

    public List<ExcelTicketModel> GetTickets(GetTicketsQuery query)
    {
        var criteria = CreateCriteria(query);
        var data = repository.GetTicketsVoidCashOut(criteria);
        var index = 1;

        return (from item in data.Tickets
                let ticketHtml = ticketHtmlService.GetTicket(item)
                select new ExcelTicketModel
                {
                    No = index++,
                    BetId = item.TransId.ToString(),
                    Player = item.UserName,
                    TransDate = ticketHtml.TransDate,
                    Odds = ticketHtml.Odds.DefaultText(),
                    Stake = ticketHtml.Stake.StakeText(),
                    Status = ticketHtml.Status.DefaultText(),
                    WinLoss = ticketHtml.WinLoss,
                    Handicap = ticketHtml.Handicap,
                    Score = ticketHtml.Score,
                    Choice = HtmlExtension.ChoiceCashOut(ticketHtml.Choice)
                }).ToList();
    }

    private static GetTicketsVoidCashOutCriteria CreateCriteria(GetTicketsQuery query)
    {
        return new GetTicketsVoidCashOutCriteria
        {
            MatchId = query.MatchId,
            FilterBy = query.FilterBy,
            Duration = query.Durations.ToXml(),
            TransIds = query.TransIds
        };
    }

    public void SetStyle(ExcelWorksheet worksheet)
    {
        worksheet.Cells.Style.WrapText = true;
        var lastRow = worksheet.Dimension.End.Row;
        worksheet.HighlightBackground($"A5:K{lastRow}", "MOD(ROW(),2)>0", Color.LemonChiffon);
        worksheet.HighlightFont($"E5:E{lastRow}", "LEFT(E5,1)=\"-\"", Color.Red);
        worksheet.HighlightFont($"G5:G{lastRow}", "LEFT(G5,1)=\"-\"", Color.Red);
    }
}