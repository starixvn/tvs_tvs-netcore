using System.Drawing;
using AutoMapper;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.Repositories;
using SpecialDelete.NumberGame.Services.GetTickets;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.NumberGame.Services.VoidTickets.ExportExcel;

public interface SheetService
{
    Task<IEnumerable<ExcelTicketModel>> GetTickets(GetVoidTicketsQuery query);

    void SetStyle(ExcelWorksheet worksheet);
}

public class SheetServiceImp(IMapper mapper, Repository repository, TicketService ticketService)
    : SheetService
{
    public async Task<IEnumerable<ExcelTicketModel>> GetTickets(GetVoidTicketsQuery query)
    {
        var tickets = new List<ExcelTicketModel>();
        var data = await GetData(query);
        var index = 1;
        foreach (var item in data)
        {
            var temp = ticketService.GetTicket(item, false);
            var ticket = mapper.Map<ExcelTicketModel>(temp);
            ticket.No = index++;
            ticket.Odds = temp.Odds.DefaultText();
            ticket.Stake = temp.Stake.StakeText();
            ticket.Choice = HtmlExtension.ChoiceNumberGame(temp.Choice);
            ticket.WinLost = temp.WinLost.LineBreak();
            tickets.Add(ticket);
        }

        return tickets;
    }

    private async Task<IEnumerable<GetTicketModel>> GetData(GetVoidTicketsQuery query)
    {
        var model = await repository.GetVoidTickets(query);
        return model.Tickets;
    }

    public void SetStyle(ExcelWorksheet worksheet)
    {
        worksheet.Cells.Style.WrapText = true;
        var lastRow = worksheet.Dimension.End.Row;
        worksheet.HighlightBackground($"A5:M{lastRow}", "MOD(ROW(),2)>0", Color.LemonChiffon);
        worksheet.HighlightFont($"F5:F{lastRow}", "LEFT(F5,1)=\"-\"", Color.Red);
        worksheet.HighlightFont($"H5:H{lastRow}", "LEFT(H5,1)=\"-\"", Color.Red);
    }
}