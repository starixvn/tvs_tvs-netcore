using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet.ExportExcel;

public class GetTicketsForExportExcelService(
    CellService cellService,
    CheckValidTransIdsService checkValidTransIdsService)
    : WorkSheetService<CheckValidTransIdsModel>
{
    public async Task BindingContent(ExcelWorksheet worksheet, CheckValidTransIdsModel model)
    {
        const int startRowIndex = 2;
        var checkTransIdViewModel = await checkValidTransIdsService.CheckValidTransIds(model);
        worksheet.ApplyVertical(checkTransIdViewModel.AbnormalBetTicketRequests, startRowIndex);
        cellService.SetStyle(worksheet);
    }
}