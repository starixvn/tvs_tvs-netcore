using AutoMapper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest.ExportExcel;

public interface GetTicketsForExportExcelService
{
    Task<IEnumerable<Group<ExcelTicketModel>>> GetGroupsExcelTickets(GetTicketsQuery query);

    Task<IEnumerable<Group<ExcelTicketNoMatchModel>>> GetGroupsExcelTicketsRequestNoMatch(GetTicketsQuery query);
}

public class GetTicketsForExportExcelServiceImp : GetTicketsForExportExcelService
{
    private readonly IMapper mapper;
    private readonly GetTicketsService getTicketsService;
    private readonly MapTicketsService mapTicketsService;
    private readonly PagingService pagingService;

    public GetTicketsForExportExcelServiceImp(IMapper mapper, GetTicketsService getTicketsService, MapTicketsService mapTicketsService, PagingService pagingService)
    {
        this.mapper = mapper;
        this.getTicketsService = getTicketsService;
        this.mapTicketsService = mapTicketsService;
        this.pagingService = pagingService;
    }

    public async Task<IEnumerable<Group<ExcelTicketModel>>> GetGroupsExcelTickets(GetTicketsQuery query)
    {
        var data = await getTicketsService.GetTickets(query);
        var groupsTickets = GenerateGroupsTickets(data);
        var groupsExcelTickets = new List<Group<ExcelTicketModel>>();
        var index = 1;

        foreach (var group in groupsTickets)
        {
            var currentExcelGroup = TransformIntoGroupExcelTickets(group, query.Match, index, query.IssueTypeId);
            groupsExcelTickets.Add(currentExcelGroup);
            index += currentExcelGroup.Tickets.Count();
        }

        return groupsExcelTickets;
    }

    private IEnumerable<Group<GetTicketModel>> GenerateGroupsTickets(IEnumerable<GetTicketModel> tickets)
    {
        if (tickets.Any())
        {
            var singleTickets = tickets.Where(ticket => !ticket.IsMixParlay).ToList();
            var groups = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
            UpdateGroupsForParlay(tickets, groups);

            return groups;
        }

        return Enumerable.Empty<Group<GetTicketModel>>();
    }

    private void UpdateGroupsForParlay(IEnumerable<GetTicketModel> tickets, List<Group<GetTicketModel>> groups)
    {
        var parlayTickets = tickets.Where(ticket => ticket.IsMixParlay)
                        .OrderBy(ticket => ticket.TransId).ToList();
        if (parlayTickets.Any())
        {
            groups.Add(new Group<GetTicketModel> { Name = "Parlay", Tickets = parlayTickets });
        }
    }

    private Group<ExcelTicketModel> TransformIntoGroupExcelTickets(Group<GetTicketModel> originalGroup, Match? match, int startIndex, int issueTypeId)
    {
        var excelTickets = new List<ExcelTicketModel>();
        var index = startIndex;
        foreach (var ticket in originalGroup.Tickets)
        {
            var ticketDetail = mapTicketsService.MapFromGetTicketModelToTicketViewModel(ticket, match, ChoiceType.Excel, issueTypeId);
            var excelTicket = mapper.Map<ExcelTicketModel>(ticketDetail);
            excelTicket.No = index++;
            excelTicket.BetId = ticketDetail.BetId.LineBreak();
            excelTicket.Member = ticketDetail.Member.LineBreak();
            excelTicket.Odds = ticketDetail.Odds.DefaultText();
            excelTicket.Stake = ticketDetail.Stake.StakeText();
            excelTicket.Status = ticketDetail.Status.DefaultText();
            excelTicket.Choice = BuildChoice(ticket, ticketDetail, issueTypeId);
            excelTickets.Add(excelTicket);
        }

        return new Group<ExcelTicketModel>
        {
            Name = originalGroup.Name,
            Tickets = excelTickets
        };
    }

    private static string BuildChoice(GetTicketModel ticket, TicketViewModel ticketDetail, int issueTypeId)
    {
        return Convert.ToInt32(ticket.BetType).IsSingleMatchParlay() || (Convert.ToInt32(ticket.BetType).IsParlay() && issueTypeId.IsAbnormalAccountOrAbnormalBet())
            ? ticketDetail.Choice
            : ticketDetail.Choice.ChoiceShortSubParlay(ticket.IsMixParlay);
    }

    public async Task<IEnumerable<Group<ExcelTicketNoMatchModel>>> GetGroupsExcelTicketsRequestNoMatch(GetTicketsQuery query)
    {
        var data = await getTicketsService.GetTickets(query);
        var groupsTickets = GenerateGroupsTickets(data);
        var groupsExcelTickets = new List<Group<ExcelTicketNoMatchModel>>();
        var index = 1;

        foreach (var group in groupsTickets)
        {
            var currentExcelGroup = TransformIntoGroupExcelTicketsRequestNoMatch(group, query.Match, index, query.IssueTypeId);
            groupsExcelTickets.Add(currentExcelGroup);
            index += currentExcelGroup.Tickets.Count();
        }

        return groupsExcelTickets;
    }

    private Group<ExcelTicketNoMatchModel> TransformIntoGroupExcelTicketsRequestNoMatch(Group<GetTicketModel> originalGroup, Match? match, int startIndex, int issueTypeId)
    {
        var excelTickets = new List<ExcelTicketNoMatchModel>();
        var index = startIndex;
        foreach (var ticket in originalGroup.Tickets)
        {
            var ticketDetail = mapTicketsService.MapFromGetTicketModelToTicketViewModel(ticket, match, ChoiceType.Excel, issueTypeId);
            var excelTicket = mapper.Map<ExcelTicketNoMatchModel>(ticketDetail);
            excelTicket.No = index++;
            excelTicket.BetId = ticketDetail.BetId.LineBreak();
            excelTicket.Member = ticketDetail.Member.LineBreak();
            excelTicket.Odds = ticketDetail.Odds.DefaultText();
            excelTicket.Stake = ticketDetail.Stake.StakeText();
            excelTicket.Status = ticketDetail.Status.DefaultText();
            excelTicket.Choice = BuildChoice(ticket, ticketDetail, issueTypeId);
            excelTickets.Add(excelTicket);
        }

        return new Group<ExcelTicketNoMatchModel>
        {
            Name = originalGroup.Name,
            Tickets = excelTickets
        };
    }
}