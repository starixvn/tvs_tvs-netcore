using OfficeOpenXml;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;

public class RequestListWorksheetService : WorkSheetService<SelectRequestsQuery>
{
    private readonly GetRequestsForExcelService getRequestsForExcelService;
    private readonly CellService cellService;

    public RequestListWorksheetService(GetRequestsForExcelService getRequestsForExcelService, CellService cellService)
    {
        this.getRequestsForExcelService = getRequestsForExcelService;
        this.cellService = cellService;
    }

    public async Task BindingContent(ExcelWorksheet worksheet, SelectRequestsQuery model)
    {
        var requests = await getRequestsForExcelService.GetRequestsExcel(model);
        cellService.RenderDataWorksheet(worksheet, requests);
        cellService.SetStyle(worksheet);

        await Task.CompletedTask;
    }
}