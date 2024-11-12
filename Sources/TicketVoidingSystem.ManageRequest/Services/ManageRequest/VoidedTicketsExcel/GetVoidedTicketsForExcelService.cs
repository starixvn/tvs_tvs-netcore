using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;

public interface GetVoidedTicketsForExcelService
{
    Task<IEnumerable<Group<ExcelVoidedTicketModel>>> GetGroupsExcelTickets(GetVoidedTicketsQuery query, Match match);
}

public class GetVoidedTicketsForExcelServiceImp(
    GetVoidedTicketsService getVoidedTicketsService,
    MapTicketsExcelService mapTicketsExcelService)
    : GetVoidedTicketsForExcelService
{
    public async Task<IEnumerable<Group<ExcelVoidedTicketModel>>> GetGroupsExcelTickets(GetVoidedTicketsQuery query, Match match)
    {
        var data = await getVoidedTicketsService.GetTickets(query);
        var groupsTickets = mapTicketsExcelService.MapToGroupVoidedTickets(data);
        var groupsExcelTickets = new List<Group<ExcelVoidedTicketModel>>();
        var index = 1;

        foreach (var group in groupsTickets)
        {
            var currentExcelGroup = mapTicketsExcelService.MapToGroupExcelVoidedTickets(group, match, index, query);
            groupsExcelTickets.Add(currentExcelGroup);
            index += currentExcelGroup.Tickets.Count();
        }

        return groupsExcelTickets;
    }
}