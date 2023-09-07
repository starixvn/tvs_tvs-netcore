using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.ViewModels;

namespace TicketVoidingSystem.VoidSingleBet.Services.GetTickets;

public interface GroupTicketService
{
    IEnumerable<Group<GetTicketModel>> CreateGroupsGetTicketModel(IEnumerable<GetTicketModel> data, GetTicketsQuery query);

    Task<Group<TicketViewModel>> CreateGroupTicketViewModel(Group<GetTicketModel> group, Match match);
}

public class GroupTicketServiceImp : GroupTicketService
{
    private readonly PagingService pagingService;
    private readonly MapTicketService mapTicketService;
    private readonly PermissionService permissionService;

    public GroupTicketServiceImp(PagingService pagingService, MapTicketService mapTicketService, PermissionService permissionService)
    {
        this.pagingService = pagingService;
        this.mapTicketService = mapTicketService;
        this.permissionService = permissionService;
    }

    public IEnumerable<Group<GetTicketModel>> CreateGroupsGetTicketModel(IEnumerable<GetTicketModel> data, GetTicketsQuery query)
    {
        var tickets = pagingService.Paging(data, query.PageIndex, query.PageSize).ToList();
        if (!tickets.Any())
        {
            return new List<Group<GetTicketModel>>();
        }

        return CreateGroupsGetTicketModel(tickets);
    }

    private IEnumerable<Group<GetTicketModel>> CreateGroupsGetTicketModel(IEnumerable<GetTicketModel> tickets)
    {
        var parlayTickets = tickets.Where(ticket => ticket.IsMixParlay).OrderBy(ticket => ticket.TransId);
        var singleTickets = tickets.Where(ticket => !ticket.IsMixParlay);
        var groups = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
        groups.Add(new Group<GetTicketModel> { Name = "Parlay", Tickets = parlayTickets });

        return groups;
    }

    public async Task<Group<TicketViewModel>> CreateGroupTicketViewModel(Group<GetTicketModel> group, Match match)
    {
        var permission = await permissionService.GetUserPermission();
        var tickets = new List<TicketViewModel>();
        var index = 1;
        foreach (var item in group.Tickets)
        {
            var ticket = mapTicketService.MapToTicketViewModel(item, match, permission);
            ticket.No = index++;
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel> { Name = group.Name, Tickets = tickets };
    }
}