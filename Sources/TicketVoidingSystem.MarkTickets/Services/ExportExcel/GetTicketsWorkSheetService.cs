using System.Threading.Tasks;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.MarkTickets.Services.ExportExcel;

public class GetTicketsWorkSheetService : WorkSheetService<GetTicketsQuery>
{
    private readonly GetTicketsService getTicketsService;
    private readonly CellService cellService;

    public GetTicketsWorkSheetService(CellService cellService, GetTicketsService getTicketsService)
    {
        this.cellService = cellService;
        this.getTicketsService = getTicketsService;
    }

    public async Task BindingContent(ExcelWorksheet worksheet, GetTicketsQuery model)
    {
        const int startRow = 8;
        worksheet.Cells[1, 1].Value = cellService.CreateTitle(model.MatchId);
        if (model.MatchId > 0)
        {
            cellService.AddMatch(worksheet, model.Match);
        }
        var tickets = await getTicketsService.GetTicketsForExportExcel(model);
        worksheet.ApplyVertical(tickets, startRow);
        cellService.SetStyle(worksheet);
    }
}