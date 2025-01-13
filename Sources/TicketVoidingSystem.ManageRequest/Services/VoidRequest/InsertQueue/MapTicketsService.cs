using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;

public interface MapTicketsService
{
    IEnumerable<RequestDetailTicketModel> MapBetIdToRequestDetailTicket(IEnumerable<BetId> tickets, int requestId, int issueTypeId);

    IEnumerable<RequestDetailTicketModel> SetVoidingTypeForTickets(CheckTicketValidationOutput validation);
}

public class MapTicketsServiceImp : MapTicketsService
{
    public IEnumerable<RequestDetailTicketModel> MapBetIdToRequestDetailTicket(IEnumerable<BetId> tickets, int requestId, int issueTypeId)
    {
        if (tickets != null && tickets.Any())
        {
            return tickets.Select(x => new RequestDetailTicketModel
            {
                RequestId = requestId,
                TransId = long.Parse(x.TransId),
                MatchId = x.MatchId ?? 0,
                SiteDbGroupId = x.SiteDbGroupId,
                IssueTypeId = issueTypeId,
                VoidActionId = ActionVoidRequestConstant.ManualVoidId
            });
        }

        return ArraySegment<RequestDetailTicketModel>.Empty;
    }

    public IEnumerable<RequestDetailTicketModel> SetVoidingTypeForTickets(CheckTicketValidationOutput validation)
    {
        var groupTickets = new List<RequestDetailTicketModel>();

        AddTicketsToGroup(groupTickets, validation.VoidSingleTickets, VoidingTypeConstant.Single);
        AddTicketsToGroup(groupTickets, validation.VoidParlayTickets, VoidingTypeConstant.Parlay);
        AddTicketsToGroup(groupTickets, validation.CancelCOTickets, VoidingTypeConstant.CancelCashOut);
        AddTicketsToGroup(groupTickets, validation.VoidCricketTickets, VoidingTypeConstant.Cricket);
        AddTicketsToGroup(groupTickets, validation.VoidSingleTickets14, VoidingTypeConstant.Single14);
        AddTicketsToGroup(groupTickets, validation.VoidParlayTickets14, VoidingTypeConstant.Parlay14);

        AddTicketsToGroup(groupTickets, validation.RecoverSingleTickets, VoidingTypeConstant.RecoverSingle);
        AddTicketsToGroup(groupTickets, validation.RecoverParlayTickets, VoidingTypeConstant.RecoverParlay);
        AddTicketsToGroup(groupTickets, validation.RecoverCricketTickets, VoidingTypeConstant.RecoverCricket);
        AddTicketsToGroup(groupTickets, validation.RecoverSingleTickets14, VoidingTypeConstant.RecoverSingle14);
        AddTicketsToGroup(groupTickets, validation.RecoverParlayTickets14, VoidingTypeConstant.RecoverParlay14);

        return groupTickets;
    }

    private static void AddTicketsToGroup(List<RequestDetailTicketModel> groups, IEnumerable<RequestDetailTicketModel> tickets, int voidingTypeId)
    {
        if (tickets == null || !tickets.Any())
        {
            return;
        }
        var ticketToList = tickets.ToList();
        foreach (var ticket in ticketToList)
        {
            ticket.VoidingTypeId = voidingTypeId;
        }

        groups.AddRange(ticketToList);
    }
}