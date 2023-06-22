using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;

public class GetVoidedTicketsWorkSheetService : WorkSheetService<GetVoidedTicketsQuery>
{
    private readonly CellService cellService;
    private readonly GetVoidedTicketsService getVoidedTicketsService;
    private readonly GetVoidedTicketsForExcelService getVoidedTicketsForExcelService;
    private readonly MatchService matchService;

    public GetVoidedTicketsWorkSheetService(CellService cellService, GetVoidedTicketsService getVoidedTicketsService,
        GetVoidedTicketsForExcelService getVoidedTicketsForExcelService, MatchService matchService)
    {
        this.cellService = cellService;
        this.getVoidedTicketsService = getVoidedTicketsService;
        this.getVoidedTicketsForExcelService = getVoidedTicketsForExcelService;
        this.matchService = matchService;
    }

    public async Task BindingContent(ExcelWorksheet worksheet, GetVoidedTicketsQuery model)
    {
        worksheet.Cells[1, 1].Value = cellService.CreateTitle(model.MatchId ?? 0);
        var match = model.IssueTypeId == IssueTypeConstant.AbnormalAccount || model.MatchId is null or 0
            ? null : await getVoidedTicketsService.GetMatchInfo(model.MatchId.Value);
        matchService.UpdateMatchInfoFromRemotingRef(match);
        AddMatchContent(worksheet, match);
        await AddTicketsContent(worksheet, model, match);
        cellService.SetStyle(worksheet);
    }

    private void AddMatchContent(ExcelWorksheet worksheet, Match match)
    {
        cellService.AddMatch(worksheet, match);
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