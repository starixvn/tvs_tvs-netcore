using AutoMapper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;

public interface MapTicketsExcelService
{
    IEnumerable<Group<VoidedTicketModel>> MapToGroupVoidedTickets(IEnumerable<VoidedTicketModel> tickets);

    Group<ExcelVoidedTicketModel> MapToGroupExcelVoidedTickets(Group<VoidedTicketModel> originalGroup, Match match, int startIndex, int issueTypeId);
}

public class MapTicketsExcelServiceImp : MapTicketsExcelService
{
    private readonly PagingService pagingService;
    private readonly MapFromBetListService mapFromBetListService;
    private readonly IMapper mapper;

    public MapTicketsExcelServiceImp(PagingService pagingService, MapFromBetListService mapFromBetListService, IMapper mapper)
    {
        this.pagingService = pagingService;
        this.mapFromBetListService = mapFromBetListService;
        this.mapper = mapper;
    }

    public IEnumerable<Group<VoidedTicketModel>> MapToGroupVoidedTickets(IEnumerable<VoidedTicketModel> tickets)
    {
        var groups = new List<Group<VoidedTicketModel>>();
        if (tickets.Any())
        {
            var singleTickets = tickets.Where(ticket => !ticket.IsMixParlay);
            groups = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
            AddParlayGroup(tickets, groups);
        }

        return groups;
    }

    private static void AddParlayGroup(IEnumerable<VoidedTicketModel> tickets, ICollection<Group<VoidedTicketModel>> groups)
    {
        var parlayTickets = tickets.Where(ticket => ticket.IsMixParlay).OrderBy(ticket => ticket.TransId);
        if (parlayTickets.Any())
        {
            groups.Add(new Group<VoidedTicketModel> { Name = "Parlay", Tickets = parlayTickets });
        }
    }

    public Group<ExcelVoidedTicketModel> MapToGroupExcelVoidedTickets(Group<VoidedTicketModel> originalGroup, Match match, int startIndex, int issueTypeId)
    {
        var excelTickets = new List<ExcelVoidedTicketModel>();
        var index = startIndex;
        foreach (var ticket in originalGroup.Tickets)
        {
            var ticketDetail = mapFromBetListService.MapToVoidedTicketViewModel(ticket, match, ChoiceType.Excel, issueTypeId);
            var excelTicket = mapper.Map<ExcelVoidedTicketModel>(ticketDetail);
            excelTicket.No = index++;
            excelTicket.BetId = ticketDetail.BetId.LineBreak();
            excelTicket.Member = ticketDetail.Member.LineBreak();
            excelTicket.Odds = ticketDetail.Odds.DefaultText();
            excelTicket.Stake = ticketDetail.Stake.StakeText();
            excelTicket.Status = ticketDetail.Status.DefaultText();
            excelTicket.Choice = BuildChoice(ticket, ticketDetail, issueTypeId);
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
        return (Convert.ToInt32(ticket.BetType).IsSingleMatchParlay()
            || (Convert.ToInt32(ticket.BetType).IsParlay() && issueTypeId.IsAbnormalAccountOrAbnormalBet())) 
            ? ticketDetail.Choice
            : ticketDetail.Choice.ChoiceShortSubParlay(ticket.IsMixParlay);       
    }
}