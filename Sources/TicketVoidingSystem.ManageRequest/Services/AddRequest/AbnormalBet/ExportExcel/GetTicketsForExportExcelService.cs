using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet.ExportExcel;

public class GetTicketsForExportExcelService : WorkSheetService<CheckValidTransIdsModel>
{
    private readonly CellService cellService;
    private readonly CheckValidTransIdsService checkValidTransIdsService;

    public GetTicketsForExportExcelService(CellService cellService, CheckValidTransIdsService checkValidTransIdsService)
    {
        this.cellService = cellService;
        this.checkValidTransIdsService = checkValidTransIdsService;
    }

    public async Task BindingContent(ExcelWorksheet worksheet, CheckValidTransIdsModel model)
    {
        const int startRowIndex = 2;
        var checkTransIdViewModel = await checkValidTransIdsService.CheckValidTransIds(model);
        worksheet.ApplyVertical(checkTransIdViewModel.AbnormalBetTicketRequests, startRowIndex);
        cellService.SetStyle(worksheet);
    }
}