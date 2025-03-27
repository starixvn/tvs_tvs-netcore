using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.PoolHouse;

public interface GeneratePoolHouseTicketService
{
    TicketsViewModel GetTicketsViewModel(IEnumerable<GetTicketModel> originTickets, GetPoolHouseTicketQuery query);
}

public class GeneratePoolHouseTicketServiceImp(MapTicketsService mapTicketsService, PagingService pagingService)
    : GeneratePoolHouseTicketService
{
    private const string OthersGroupName = "Others";

    public TicketsViewModel GetTicketsViewModel(IEnumerable<GetTicketModel> originTickets, GetPoolHouseTicketQuery query)
    {
        if (originTickets == null || !originTickets.Any())
        {
            return new TicketsViewModel();
        }

        var ticketsList = originTickets.ToList();
        var groups = GenerateTicketGroups(ticketsList)
            .Where(group => group.Tickets.Any())
            .Select(group => CreateGroupViewModel(group, query.IssueTypeId))
            .ToList();

        var viewModel = new TicketsViewModel
        {
            TotalSingle = originTickets.Count(x => !x.IsMixParlay),
            TotalParlay = originTickets.Count(x => x.IsMixParlay),
            Groups = groups
        };

        return viewModel;
    }

    private IEnumerable<Group<GetTicketModel>> GenerateTicketGroups(List<GetTicketModel> tickets)
    {
        if (tickets.Count == 0)
        {
            return [];
        }

        var groupedTickets = SeparateTicketsByType(tickets);
        var groups = CreateGroupsFromSeparatedTickets(groupedTickets);
        UpdateGroupTicketCounts(tickets, groups);

        return groups;
    }

    private TicketGroups SeparateTicketsByType(IEnumerable<GetTicketModel> tickets)
    {
        var parlayTickets = tickets.Where(ticket =>
            IsParlayPoolHouseTicket(ticket.IsMixParlay, ticket.GroupName)).ToList();

        return new TicketGroups
        {
            CreditParlay = parlayTickets
                .Where(t => !t.IsDeposit)
                .OrderBy(t => t.TransId).ToList(),

            DepositParlay = parlayTickets
                .Where(t => t.IsDeposit)
                .OrderBy(t => t.TransId).ToList(),

            Others = tickets
                .Where(t => t.GroupName == OthersGroupName)
                .OrderBy(t => t.TransId).ToList(),

            Single = tickets.Where(t => !t.IsMixParlay && t.GroupName != OthersGroupName).ToList()
        };
    }

    private List<Group<GetTicketModel>> CreateGroupsFromSeparatedTickets(TicketGroups groupedTickets)
    {
        var groups = pagingService.Groups(groupedTickets.Single, ticket => ticket.GroupName).ToList();

        AddGroupIfHasTickets(groups, GroupTicket.Credit, groupedTickets.CreditParlay);
        AddGroupIfHasTickets(groups, GroupTicket.Deposit, groupedTickets.DepositParlay);
        AddGroupIfHasTickets(groups, OthersGroupName, groupedTickets.Others);

        return groups;
    }

    private static void AddGroupIfHasTickets(List<Group<GetTicketModel>> groups, string groupName, List<GetTicketModel> tickets)
    {
        if (tickets.Count > 0)
        {
            groups.Add(new Group<GetTicketModel>
            {
                Name = groupName,
                Tickets = tickets
            });
        }
    }

    private static void UpdateGroupTicketCounts(IEnumerable<GetTicketModel> allTickets, IEnumerable<Group<GetTicketModel>> groups)
    {
        var ticketCounts = allTickets
            .GroupBy(x => x.GroupName, StringComparer.CurrentCultureIgnoreCase)
            .ToDictionary(g => g.Key, g => g.Count(), StringComparer.CurrentCultureIgnoreCase);

        foreach (var group in groups)
        {
            group.DisplayTotalTickets = ticketCounts.GetValueOrDefault(group.Name);
        }
    }

    private static bool IsParlayPoolHouseTicket(bool isMixParlay, string groupName)
    {
        return isMixParlay && groupName is GroupTicket.Credit or GroupTicket.Deposit;
    }

    private Group<TicketViewModel> CreateGroupViewModel(Group<GetTicketModel> group, int issueTypeId)
    {
        var tickets = new List<TicketViewModel>();

        foreach (var item in group.Tickets)
        {
            var ticket = mapTicketsService.MapFromGetTicketModelToTicketViewModel(
                item,
                null,
                ChoiceType.None,
                issueTypeId);

            ticket.SubBetTypeId = (short)item.SubBetType;
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel>
        {
            Name = group.Name,
            Tickets = tickets,
            DisplayTotalTickets = group.DisplayTotalTickets
        };
    }

    private sealed class TicketGroups
    {
        public List<GetTicketModel> CreditParlay { get; init; } = [];
        public List<GetTicketModel> DepositParlay { get; init; } = [];
        public List<GetTicketModel> Others { get; init; } = [];
        public List<GetTicketModel> Single { get; init; } = [];
    }
}