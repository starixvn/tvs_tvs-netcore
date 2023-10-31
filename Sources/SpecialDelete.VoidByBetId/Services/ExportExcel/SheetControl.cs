using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using SpecialDelete.VoidByBetId.Models;
using TicketVoidingSystem.Services.Excel;

namespace SpecialDelete.VoidByBetId.Services.ExportExcel;

public class SheetControlImp : WorkSheetService<GetTicketsQuery>
{
    private readonly SheetService sheetService;

    public SheetControlImp(SheetService sheetService)
    {
        this.sheetService = sheetService;
    }

    public async Task BindingContent(ExcelWorksheet worksheet, GetTicketsQuery model)
    {
        const int startRow = 5;
        var tickets = await sheetService.GetTickets(model);
        worksheet.ApplyVertical(tickets, startRow);
        sheetService.SetStyle(worksheet);
    }
}