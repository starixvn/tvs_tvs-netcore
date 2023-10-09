using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using TicketVoidingSystem.Services.Excel;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Services.ExportExcel;

public class SheetControlImp : WorkSheetService<ExportExcelQuery>
{
    private readonly SheetService sheetService;

    public SheetControlImp(SheetService sheetService)
    {
        this.sheetService = sheetService;
    }

    public async Task BindingContent(ExcelWorksheet worksheet, ExportExcelQuery model)
    {
        const int startRow = 8;
        var tickets = await sheetService.GetTickets(model);
        worksheet.ApplyVertical(tickets, startRow);

        sheetService.SetStyle(worksheet);

        sheetService.EditMatch(worksheet, model);
    }
}