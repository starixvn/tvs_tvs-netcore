using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using SpecialDelete.CashOutTransaction.Common.Models;
using TicketVoidingSystem.Services.Excel;

namespace SpecialDelete.CashOutTransaction.CancelCashOut.Services.ExportExcel;

public class SheetControlImp(SheetService sheetService) : WorkSheetService<GetTicketsQuery>
{
    public async Task BindingContent(ExcelWorksheet worksheet, GetTicketsQuery model)
    {
        const int startRow = 5;
        var tickets = await sheetService.GetTickets(model);
        worksheet.ApplyVertical(tickets, startRow);
        sheetService.SetStyle(worksheet);
        await Task.CompletedTask;
    }
}