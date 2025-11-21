using OfficeOpenXml;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRemark.RemarkListExcel;

public class RemarkListWorksheetService(
    GetRemarksForExcelService getRemarksForExcelService,
    CellService cellService)
    : WorkSheetService<SelectRemarksQuery>
{
    public async Task BindingContent(ExcelWorksheet worksheet, SelectRemarksQuery model)
    {
        var remarks = await getRemarksForExcelService.GetRemarksExcel(model);
        cellService.RenderDataWorksheet(worksheet, remarks);
        cellService.SetStyle(worksheet);

        await Task.CompletedTask;
    }
}