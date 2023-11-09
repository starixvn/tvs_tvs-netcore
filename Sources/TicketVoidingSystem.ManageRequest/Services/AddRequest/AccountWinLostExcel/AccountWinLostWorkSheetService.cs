using OfficeOpenXml;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AccountWinLostExcel;

public class AccountWinLostWorkSheetService : WorkSheetService<ExportAccountWinLostQuery>
{
    private readonly AccountWinLostService accountWinLostService;
    private readonly CellService cellService;

    public AccountWinLostWorkSheetService(AccountWinLostService accountWinLostService, CellService cellService)
    {
        this.accountWinLostService = accountWinLostService;
        this.cellService = cellService;
    }

    public async Task BindingContent(ExcelWorksheet worksheet, ExportAccountWinLostQuery query)
    {
        var accountExcelModels = accountWinLostService.GetAccountWinLostExcel(query.Accounts);
        cellService.RenderDataWorksheet(worksheet, accountExcelModels);
        cellService.SetStyle(worksheet);

        await Task.CompletedTask;
    }
}