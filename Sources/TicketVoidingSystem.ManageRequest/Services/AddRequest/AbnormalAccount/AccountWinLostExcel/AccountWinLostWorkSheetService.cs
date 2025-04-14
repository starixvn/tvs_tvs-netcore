using OfficeOpenXml;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.AccountWinLostExcel;

public class AccountWinLostWorkSheetService(AccountWinLostService accountWinLostService, CellService cellService)
    : WorkSheetService<ExportAccountWinLostQuery>
{
    public async Task BindingContent(ExcelWorksheet worksheet, ExportAccountWinLostQuery query)
    {
        var accountExcelModels = accountWinLostService.GetAccountWinLostExcel(query.Accounts);
        cellService.RenderDataWorksheet(worksheet, accountExcelModels);
        cellService.SetStyle(worksheet);

        await Task.CompletedTask;
    }
}