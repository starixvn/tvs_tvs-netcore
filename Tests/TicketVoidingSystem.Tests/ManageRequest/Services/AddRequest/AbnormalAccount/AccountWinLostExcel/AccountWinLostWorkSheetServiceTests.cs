using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using OfficeOpenXml;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.AccountWinLostExcel;
using Xunit;
using CellService = TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.AccountWinLostExcel.CellService;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalAccount.AccountWinLostExcel;

public class AccountWinLostWorkSheetServiceTests
{
    private readonly CellService cellService;
    private readonly AccountWinLostService accountWinLostService;

    private readonly AccountWinLostWorkSheetService service;

    public AccountWinLostWorkSheetServiceTests()
    {
        accountWinLostService = Substitute.For<AccountWinLostService>();
        cellService = Substitute.For<CellService>();

        service = new AccountWinLostWorkSheetService(accountWinLostService, cellService);
    }

    [Fact]
    public async Task BindingContent_RendersDataAndAppliesStyleToWorksheet()
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        var package = new ExcelPackage();
        var sheet = package.Workbook.Worksheets.Add("Template");

        var query = new ExportAccountWinLostQuery
        {
            Accounts = new List<AccountWinlostModel>()
        };
        var requests = new List<AccountWinlostExcelModel>
        {
            new() { Username = "1" },
            new() { Username = "2" },
            new() { Username = "3" },
        };

        accountWinLostService.GetAccountWinLostExcel(null).ReturnsForAnyArgs(requests);

        // Act
        await service.BindingContent(sheet, query);

        // Assert
        accountWinLostService.Received(1).GetAccountWinLostExcel(query.Accounts);
        cellService.Received(1).RenderDataWorksheet(sheet, requests);
        cellService.Received(1).SetStyle(sheet);
    }
}