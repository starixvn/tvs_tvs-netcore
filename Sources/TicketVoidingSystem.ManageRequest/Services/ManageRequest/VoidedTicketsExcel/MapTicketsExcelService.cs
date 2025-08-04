using AutoMapper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;

public interface MapTicketsExcelService
{
    IEnumerable<Group<VoidedTicketModel>> MapToGroupVoidedTickets(IEnumerable<VoidedTicketModel> tickets);

    Group<ExcelVoidedTicketModel> MapToGroupExcelVoidedTickets(Group<VoidedTicketModel> originalGroup, Match match, int startIndex, GetVoidedTicketsQuery query);
}

public class MapTicketsExcelServiceImp(
    PagingService pagingService,
    MapFromBetListService mapFromBetListService,
    IMapper mapper)
    : MapTicketsExcelService
{
    public IEnumerable<Group<VoidedTicketModel>> MapToGroupVoidedTickets(IEnumerable<VoidedTicketModel> tickets)
    {
        if (!tickets.Any())
        {
            return [];
        }

        var parlayTickets = tickets.Where(ticket => ticket.IsMixParlay);
        var creditParlayTickets = parlayTickets.Where(ticket => !ticket.IsDeposit).OrderBy(ticket => ticket.TransId).ToList();
        var depositParlayTickets = parlayTickets.Where(ticket => ticket.IsDeposit).OrderBy(ticket => ticket.TransId).ToList();
        var singleTickets = tickets.Where(ticket => !ticket.IsMixParlay);

        var groups = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
        if (creditParlayTickets.Count != 0)
        {
            groups.Add(new Group<VoidedTicketModel> { Name = GroupTicket.Credit, Tickets = creditParlayTickets });
        }
        if (depositParlayTickets.Count != 0)
        {
            groups.Add(new Group<VoidedTicketModel> { Name = GroupTicket.Deposit, Tickets = depositParlayTickets });
        }

        return groups;
    }

    public Group<ExcelVoidedTicketModel> MapToGroupExcelVoidedTickets(Group<VoidedTicketModel> originalGroup, Match match, int startIndex, GetVoidedTicketsQuery query)
    {
        var excelTickets = new List<ExcelVoidedTicketModel>();
        var index = startIndex;
        foreach (var ticket in originalGroup.Tickets)
        {
            var ticketDetail = mapFromBetListService.MapToVoidedTicketViewModel(ticket, match, ChoiceType.Excel, query);
            var excelTicket = mapper.Map<ExcelVoidedTicketModel>(ticketDetail);
            excelTicket.No = index++;
            excelTicket.BetId = ticketDetail.BetId.LineBreak();
            excelTicket.Member = ticketDetail.Member.LineBreak();
            excelTicket.Odds = ticketDetail.Odds.DefaultText();
            excelTicket.Stake = ticketDetail.Stake.StakeText();
            excelTicket.Status = ticketDetail.Status.DefaultText();
            excelTicket.Choice = BuildChoice(ticket, ticketDetail, query.IssueTypeId);
            excelTickets.Add(excelTicket);
        }

        return new Group<ExcelVoidedTicketModel>
        {
            Name = originalGroup.Name,
            Tickets = excelTickets
        };
    }

    private static string BuildChoice(VoidedTicketModel ticket, VoidedTicketViewModel ticketDetail, int issueTypeId)
    {
        return Convert.ToInt32(ticket.BetType).IsSingleMatchParlay()
               || (Convert.ToInt32(ticket.BetType).IsParlay() && issueTypeId.IsIssueTypeVoidMainParlay())
            ? ticketDetail.Choice
            : ticketDetail.Choice.ChoiceShortSubParlay(ticket.IsMixParlay);
    }
}