using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.TicketListing.Criteria;

namespace TicketVoidingSystem.TicketListing.Services.ExportExcel;

public class GetTicketsWorkSheetService : WorkSheetService<ExportExcelQuery>
{
    private readonly CellService cellService;
    private readonly GetTicketsService getTicketsService;

    public GetTicketsWorkSheetService(CellService cellService, GetTicketsService getTicketsService)
    {
        this.cellService = cellService;
        this.getTicketsService = getTicketsService;
    }

    public async Task BindingContent(ExcelWorksheet worksheet, ExportExcelQuery model)
    {
        worksheet.Cells[1, 1].Value = cellService.CreateTitle(model);
        cellService.AddMatch(worksheet, model);
        var tickets = await getTicketsService.GetTicketsForExportExcel(model);
        const int startRowIndex = 8;
        worksheet.ApplyVertical(tickets, startRowIndex);
        cellService.SetStyle(worksheet, model.Product == GameType.NumberGame);
    }
}