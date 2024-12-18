using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;

namespace TicketVoidingSystem.VoidSingleBet.Services.ExportExcel;

public class GetTicketsWorksheetService(GetTicketsService getTicketsService, CellService cellService)
    : WorkSheetService<GetTicketsQuery>
{
    public async Task BindingContent(ExcelWorksheet worksheet, GetTicketsQuery model)
    {
        const int startRow = 8;
        worksheet.Cells[1, 1].Value = cellService.CreateTitle(model.MatchId);
        cellService.AddMatch(worksheet, model.Match);
        var tickets = await getTicketsService.GetTicketsForExportExcel(model);
        worksheet.ApplyVertical(tickets, startRow);
        cellService.SetStyle(worksheet);
    }
}