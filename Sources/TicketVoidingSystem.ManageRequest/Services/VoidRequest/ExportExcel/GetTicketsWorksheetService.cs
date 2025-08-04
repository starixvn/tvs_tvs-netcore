using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest.ExportExcel;

public class GetTicketsWorksheetService(
    GetTicketsForExportExcelService getTicketsForExportExcelService,
    CellService cellService)
    : WorkSheetService<GetTicketsQuery>
{
    public async Task BindingContent(ExcelWorksheet worksheet, GetTicketsQuery model)
    {
        bool isHasMatch;
        if (model.Match != null)
        {
            isHasMatch = true;
            await BindingContentWithMatchInfo(worksheet, model);
        }
        else
        {
            isHasMatch = false;
            await BindingContentNoMatchInfo(worksheet, model);
        }

        cellService.SetStyle(worksheet, isHasMatch);
    }

    private async Task BindingContentWithMatchInfo(ExcelWorksheet worksheet, GetTicketsQuery model)
    {
        var startRow = 8;
        worksheet.Cells[1, 1].Value = cellService.CreateTitle(model.Match.MatchId);
        cellService.AddMatch(worksheet, model.Match);

        var groupsExcelTickets = await getTicketsForExportExcelService.GetGroupsExcelTickets(model);
        foreach (var group in groupsExcelTickets)
        {
            cellService.WriteGroupHeader(worksheet, startRow, group.Name, group.Tickets.Count());
            worksheet.ApplyVertical(group.Tickets, startRow + 1);
            startRow = startRow + 1 + group.Tickets.Count();
        }
    }

    private async Task BindingContentNoMatchInfo(ExcelWorksheet worksheet, GetTicketsQuery model)
    {
        var startRow = 5;
        worksheet.Cells[1, 1].Value = "Void Bet";

        var groupsExcelTickets = await getTicketsForExportExcelService.GetGroupsExcelTicketsRequestNoMatch(model);
        foreach (var group in groupsExcelTickets)
        {
            cellService.WriteGroupHeader(worksheet, startRow, group.Name, group.Tickets.Count());
            worksheet.ApplyVertical(group.Tickets, startRow + 1);
            startRow = startRow + 1 + group.Tickets.Count();
        }
    }
}