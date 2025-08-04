using OfficeOpenXml;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;

public class RequestListWorksheetService(GetRequestsForExcelService getRequestsForExcelService, CellService cellService)
    : WorkSheetService<SelectRequestsQuery>
{
    public async Task BindingContent(ExcelWorksheet worksheet, SelectRequestsQuery model)
    {
        var requests = await getRequestsForExcelService.GetRequestsExcel(model);
        cellService.RenderDataWorksheet(worksheet, requests);
        cellService.SetStyle(worksheet);

        await Task.CompletedTask;
    }
}