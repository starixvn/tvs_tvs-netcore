using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;

public class GetVoidedTicketsWorkSheetService : WorkSheetService<GetVoidedTicketsQuery>
{
    private readonly CellService cellService;
    private readonly GetVoidedTicketsService getVoidedTicketsService;
    private readonly GetVoidedTicketsForExcelService getVoidedTicketsForExcelService;

    public GetVoidedTicketsWorkSheetService(CellService cellService, GetVoidedTicketsService getVoidedTicketsService, GetVoidedTicketsForExcelService getVoidedTicketsForExcelService)
    {
        this.cellService = cellService;
        this.getVoidedTicketsService = getVoidedTicketsService;
        this.getVoidedTicketsForExcelService = getVoidedTicketsForExcelService;
    }

    public async Task BindingContent(ExcelWorksheet worksheet, GetVoidedTicketsQuery model)
    {
        worksheet.Cells[1, 1].Value = cellService.CreateTitle(model.MatchId);
        var match = model.IssueTypeId == IssueTypeConstant.AbnormalAccount ? null : await getVoidedTicketsService.GetMatchInfo(model.MatchId);
        AddMatchContent(worksheet, match);
        await AddTicketsContent(worksheet, model, match);
        cellService.SetStyle(worksheet);
    }

    private void AddMatchContent(ExcelWorksheet worksheet, Match match)
    {
        if (match != null)
        {
            cellService.AddMatch(worksheet, match);
        }
    }

    private async Task AddTicketsContent(ExcelWorksheet worksheet, GetVoidedTicketsQuery model, Match match)
    {
        var startRow = 8;
        var groupsExcelTickets = await getVoidedTicketsForExcelService.GetGroupsExcelTickets(model, match);
        foreach (var group in groupsExcelTickets)
        {
            cellService.WriteGroupHeader(worksheet, startRow, group);
            worksheet.ApplyVertical(group.Tickets, startRow + 1);
            startRow = startRow + 1 + group.Tickets.Count();
        }
    }
}