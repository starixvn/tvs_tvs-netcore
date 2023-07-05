using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface GetPoolHouseTicketService
{
    TicketsViewModel GetTicketsViewModel(IEnumerable<GetTicketModel> originTickets, GetPoolHouseTicketRequest request);
}

public class GetPoolHouseTicketServiceImp : GetPoolHouseTicketService
{
    private readonly MapTicketsService mapTicketsService;
    private readonly PagingService pagingService;

    public GetPoolHouseTicketServiceImp(MapTicketsService mapTicketsService, PagingService pagingService)
    {
        this.mapTicketsService = mapTicketsService;
        this.pagingService = pagingService;
    }

    public TicketsViewModel GetTicketsViewModel(IEnumerable<GetTicketModel> originTickets, GetPoolHouseTicketRequest request)
    {
        var startIndex = request.PageIndex * request.PageSize + 1;
        var groups = GenerateGroup(originTickets, request)
            .Where(item => item.Tickets.Any())
            .Select((item, index) => MapToGroupTicketViewModel(item, index + startIndex, request.IssueTypeId));

        var viewModel = new TicketsViewModel
        {
            TotalSingle = originTickets.Count(x => !x.IsMixParlay),
            TotalParlay = originTickets.Count(x => x.IsMixParlay),
            Groups = groups
        };

        return viewModel;
    }

    private IEnumerable<Group<GetTicketModel>> GenerateGroup(IEnumerable<GetTicketModel> originTickets, GetPoolHouseTicketRequest request)
    {
        if (!originTickets.Any())
        {
            return Enumerable.Empty<Group<GetTicketModel>>();
        }

        var afterPagingTickets = pagingService.Paging(originTickets, request.PageIndex, request.PageSize);
        return !afterPagingTickets.Any() ? Enumerable.Empty<Group<GetTicketModel>>() : GenerateGroupWhenHaveTicket(originTickets, afterPagingTickets);
    }

    private IEnumerable<Group<GetTicketModel>> GenerateGroupWhenHaveTicket(IEnumerable<GetTicketModel> originTickets, IEnumerable<GetTicketModel> afterPagingTickets)
    {
        var parlayTicketsPoolHouse = afterPagingTickets.Where(ticket => ticket.IsMixParlay && ticket.GroupName == "Parlay")
            .OrderBy(ticket => ticket.TransId).ToList();
        var othersTickets = afterPagingTickets.Where(ticket => ticket.GroupName == "Others")
            .OrderBy(ticket => ticket.TransId).ToList();
        var singleTickets = afterPagingTickets.Where(ticket => !ticket.IsMixParlay && ticket.GroupName != "Others").ToList();

        var groups = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
        groups.Add(new Group<GetTicketModel> { Name = "Parlay", Tickets = parlayTicketsPoolHouse });
        groups.Add(new Group<GetTicketModel> { Name = "Others", Tickets = othersTickets });

        CountAllTicketsForGroup(originTickets, groups);

        return groups;
    }

    private static void CountAllTicketsForGroup(IEnumerable<GetTicketModel> originalTickets, IEnumerable<Group<GetTicketModel>> outputGroups)
    {
        foreach (var group in outputGroups)
        {
            var total = originalTickets.Count(x => x.GroupName.Equals(group.Name, StringComparison.CurrentCultureIgnoreCase));
            group.DisplayTotalTickets = total;
        }
    }

    private Group<TicketViewModel> MapToGroupTicketViewModel(Group<GetTicketModel> group, int startIndex, int issueTypeId)
    {
        var tickets = new List<TicketViewModel>();
        var index = startIndex;

        foreach (var item in group.Tickets)
        {
            var ticket = mapTicketsService.MapFromGetTicketModelToTicketViewModel(item, null, ChoiceType.None, issueTypeId);
            ticket.SubBetTypeId = (short)item.SubBetType;
            ticket.No = index++;
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel>
        {
            Name = group.Name,
            Tickets = tickets,
            DisplayTotalTickets = group.DisplayTotalTickets
        };
    }
}