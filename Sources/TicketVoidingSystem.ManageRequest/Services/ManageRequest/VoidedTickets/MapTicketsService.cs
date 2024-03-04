using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;

public interface MapTicketsService
{
    IEnumerable<Group<VoidedTicketModel>> MapToGroupVoidedTickets(IEnumerable<VoidedTicketModel> originalTickets, GetVoidedTicketsQuery query);

    Group<VoidedTicketViewModel> MapToGroupVoidedTicketsViewModel(Group<VoidedTicketModel> group, Match? match, int startIndex, GetVoidedTicketsQuery query);
}

public class MapTicketsServiceImp : MapTicketsService
{
    private readonly PagingService pagingService;
    private readonly MapFromBetListService mapFromBetListService;

    public MapTicketsServiceImp(PagingService pagingService, MapFromBetListService mapFromBetListService)
    {
        this.pagingService = pagingService;
        this.mapFromBetListService = mapFromBetListService;
    }

    public IEnumerable<Group<VoidedTicketModel>> MapToGroupVoidedTickets(IEnumerable<VoidedTicketModel> originalTickets, GetVoidedTicketsQuery query)
    {
        var tickets = pagingService.Paging(originalTickets, query.PageIndex, query.PageSize);
        if (tickets.Any())
        {
            var parlayTickets = tickets.Where(ticket => ticket.IsMixParlay).OrderBy(ticket => ticket.TransId);
            var singleTickets = tickets.Where(ticket => !ticket.IsMixParlay);
            var groups = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
            groups.Add(new Group<VoidedTicketModel> { Name = "Parlay", Tickets = parlayTickets });

            UpdateCountTicketsByGroup(originalTickets, groups);
            return groups;
        }

        return Enumerable.Empty<Group<VoidedTicketModel>>();
    }

    public Group<VoidedTicketViewModel> MapToGroupVoidedTicketsViewModel(Group<VoidedTicketModel> group, Match? match, int startIndex, GetVoidedTicketsQuery query)
    {
        var tickets = new List<VoidedTicketViewModel>();
        var index = startIndex;

        foreach (var item in group.Tickets)
        {
            var ticket = mapFromBetListService.MapToVoidedTicketViewModel(item, match, ChoiceType.Html, query);
            ticket.No = index++;
            tickets.Add(ticket);
        }

        return new Group<VoidedTicketViewModel>
        {
            Name = group.Name,
            Tickets = tickets,
            DisplayTotalTickets = group.DisplayTotalTickets
        };
    }

    private void UpdateCountTicketsByGroup(IEnumerable<VoidedTicketModel> originalTickets, IEnumerable<Group<VoidedTicketModel>> outputGroups)
    {
        var parlayTickets = originalTickets.Where(ticket => ticket.IsMixParlay).OrderBy(ticket => ticket.TransId);
        var singleTickets = originalTickets.Where(ticket => !ticket.IsMixParlay);
        var allGroups = pagingService.Groups(singleTickets, t => t.GroupName).ToList();
        allGroups.Add(new Group<VoidedTicketModel> { Name = "Parlay", Tickets = parlayTickets });

        foreach (var group in outputGroups)
        {
            var total = allGroups.Find(x => x.Name.Equals(group.Name, StringComparison.CurrentCultureIgnoreCase))?.Tickets.Count();
            group.DisplayTotalTickets = total ?? 0;
        }
    }
}