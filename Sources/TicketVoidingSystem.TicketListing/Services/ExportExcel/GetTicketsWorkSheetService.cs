using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.TicketListing.Criteria;

namespace TicketVoidingSystem.TicketListing.Services.ExportExcel;

public class GetTicketsWorkSheetService(CellService cellService) : WorkSheetService<ExportExcelQuery>
{
    public async Task BindingContent(ExcelWorksheet worksheet, ExportExcelQuery model)
    {
        worksheet.Cells[1, 1].Value = cellService.CreateTitle(model);
        cellService.AddMatch(worksheet, model);
        const int startRowIndex = 8;
        worksheet.ApplyVertical(model.Tickets, startRowIndex);
        cellService.SetStyle(worksheet, model.Product == GameType.NumberGame);
        await Task.CompletedTask;
    }
}