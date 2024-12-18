using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using SpecialDelete.NumberGame.Models;
using TicketVoidingSystem.Services.Excel;

namespace SpecialDelete.NumberGame.Services.VoidTickets.ExportExcel;

public class SheetControlImp(SheetService sheetService) : WorkSheetService<GetVoidTicketsQuery>
{
    public async Task BindingContent(ExcelWorksheet worksheet, GetVoidTicketsQuery model)
    {
        var tickets = await sheetService.GetTickets(model);
        const int StartRow = 5;
        worksheet.ApplyVertical(tickets, StartRow);
        sheetService.SetStyle(worksheet);
    }
}