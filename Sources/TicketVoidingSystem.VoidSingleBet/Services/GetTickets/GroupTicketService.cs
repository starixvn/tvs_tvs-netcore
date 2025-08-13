using TicketVoidingSystem.Constants;
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

public class GroupTicketServiceImp(
    PagingService pagingService,
    MapTicketService mapTicketService,
    PermissionService permissionService)
    : GroupTicketService
{
    public IEnumerable<Group<GetTicketModel>> CreateGroupsGetTicketModel(IEnumerable<GetTicketModel> data, GetTicketsQuery query)
    {
        var tickets = pagingService.Paging(data, query.PageIndex, query.PageSize).ToList();
        return !tickets.Any() ? new List<Group<GetTicketModel>>() : CreateGroupsGetTicketModel(tickets);
    }

    private IEnumerable<Group<GetTicketModel>> CreateGroupsGetTicketModel(IEnumerable<GetTicketModel> tickets)
    {
        var parlayTickets = tickets.Where(ticket => ticket.IsMixParlay);
        var creditParlayTickets = parlayTickets.Where(ticket => !ticket.IsDeposit).OrderBy(ticket => ticket.TransId).ToList();
        var depositParlayTickets = parlayTickets.Where(ticket => ticket.IsDeposit).OrderBy(ticket => ticket.TransId).ToList();
        var singleTickets = tickets.Where(ticket => !ticket.IsMixParlay);

        var groups = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
        if (creditParlayTickets.Count != 0)
        {
            groups.Add(new Group<GetTicketModel> { Name = GroupTicket.Credit, Tickets = creditParlayTickets });
        }
        if (depositParlayTickets.Count != 0)
        {
            groups.Add(new Group<GetTicketModel> { Name = GroupTicket.Deposit, Tickets = depositParlayTickets });
        }

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