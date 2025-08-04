using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;

public class GetVoidedTicketsWorkSheetService(
    CellService cellService,
    GetVoidedTicketsService getVoidedTicketsService,
    GetVoidedTicketsForExcelService getVoidedTicketsForExcelService,
    MatchService matchService,
    BetListService betListService)
    : WorkSheetService<GetVoidedTicketsQuery>
{
    public async Task BindingContent(ExcelWorksheet worksheet, GetVoidedTicketsQuery model)
    {
        worksheet.Cells[1, 1].Value = cellService.CreateTitle(model.MatchId ?? 0, model.IssueTypeId);
        var match = IsNotAddMatchForExcel(model.IssueTypeId, model.MatchId) ? null : await getVoidedTicketsService.GetMatchInfo(model.MatchId.Value);
        matchService.UpdateMatchInfoFromRemotingRef(match);
        if (match != null)
        {
            match.MatchCode = betListService.GetVirtualSportMatchCode(match.SportType, match.MatchCode);
        }

        AddMatchContent(worksheet, match);
        await AddTicketsContent(worksheet, model, match);
        cellService.SetStyle(worksheet, model.IssueTypeId);
    }

    private static bool IsNotAddMatchForExcel(int issueTypeId, int? matchId)
    {
        return issueTypeId == IssueTypeConstant.AbnormalAccount || issueTypeId == IssueTypeConstant.RecoverTicket || matchId is null or 0;
    }

    private void AddMatchContent(ExcelWorksheet worksheet, Match? match)
    {
        cellService.AddMatch(worksheet, match);
    }

    private async Task AddTicketsContent(ExcelWorksheet worksheet, GetVoidedTicketsQuery model, Match match)
    {
        var startRow = model.IssueTypeId != IssueTypeConstant.RecoverTicket ? 8 : 5;
        var groupsExcelTickets = await getVoidedTicketsForExcelService.GetGroupsExcelTickets(model, match);
        foreach (var group in groupsExcelTickets)
        {
            cellService.WriteGroupHeader(worksheet, startRow, group);
            worksheet.ApplyVertical(group.Tickets, startRow + 1);
            startRow = startRow + 1 + group.Tickets.Count();
        }
    }
}