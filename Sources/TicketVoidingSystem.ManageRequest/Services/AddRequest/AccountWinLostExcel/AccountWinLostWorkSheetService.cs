using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AccountWinLostExcel;

public class AccountWinLostWorkSheetService : WorkSheetService<GetAccountWinLostQuery>
{
    private readonly AccountWinLostService accountWinLostService;
    private readonly CellService cellService;

    public AccountWinLostWorkSheetService(AccountWinLostService accountWinLostService, CellService cellService)
    {
        this.accountWinLostService = accountWinLostService;
        this.cellService = cellService;
    }

    public async Task BindingContent(ExcelWorksheet worksheet, GetAccountWinLostQuery query)
    {
        const int startRowIndex = 2;
        var accounts = await accountWinLostService.GetAccountWinLostExcel(query);
        worksheet.ApplyVertical(accounts, startRowIndex);
        cellService.SetStyle(worksheet);

        await Task.CompletedTask;
    }
}