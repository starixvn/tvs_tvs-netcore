using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.ExportExcel;

public class GetTicketsForExportExcelService : WorkSheetService<ExportTicketAbnormalBetQuery>
{
    private readonly CellService cellService;

    public GetTicketsForExportExcelService(CellService cellService)
    {
        this.cellService = cellService;
    }

    public Task BindingContent(ExcelWorksheet worksheet, ExportTicketAbnormalBetQuery model)
    {
        const int startRowIndex = 2;
        worksheet.ApplyVertical(model.Tickets, startRowIndex);
        cellService.SetStyle(worksheet);
        return Task.CompletedTask;
    }
}