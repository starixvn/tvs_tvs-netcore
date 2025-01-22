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

public class GetPoolHouseTicketServiceImp(MapTicketsService mapTicketsService, PagingService pagingService)
    : GetPoolHouseTicketService
{
    public TicketsViewModel GetTicketsViewModel(IEnumerable<GetTicketModel> originTickets, GetPoolHouseTicketRequest request)
    {
        var groupsHaveTickets = GenerateGroup(originTickets)
            .Where(item => item.Tickets.Any());

        var groupViewModels = groupsHaveTickets.Select(group => MapToGroupTicketViewModel(group, request.IssueTypeId)).ToList();

        var viewModel = new TicketsViewModel
        {
            TotalSingle = originTickets.Count(x => !x.IsMixParlay),
            TotalParlay = originTickets.Count(x => x.IsMixParlay),
            Groups = groupViewModels
        };

        return viewModel;
    }

    private IEnumerable<Group<GetTicketModel>> GenerateGroup(IEnumerable<GetTicketModel> originTickets)
    {
        return !originTickets.Any() ? [] : GenerateGroupWhenHaveTicket(originTickets, originTickets);
    }

    private IEnumerable<Group<GetTicketModel>> GenerateGroupWhenHaveTicket(IEnumerable<GetTicketModel> originTickets, IEnumerable<GetTicketModel> afterPagingTickets)
    {
        if (!originTickets.Any())
        {
            return [];
        }

        var parlayTicketsPoolHouse = afterPagingTickets.Where(ticket => IsParlayTicketsPoolHouse(ticket.IsMixParlay, ticket.GroupName)).ToList();
        var creditParlayTickets = parlayTicketsPoolHouse.Where(ticket => !ticket.IsDeposit).OrderBy(ticket => ticket.TransId).ToList();
        var depositParlayTickets = parlayTicketsPoolHouse.Where(ticket => ticket.IsDeposit).OrderBy(ticket => ticket.TransId).ToList();
        var othersTickets = afterPagingTickets.Where(ticket => ticket.GroupName == "Others")
            .OrderBy(ticket => ticket.TransId).ToList();
        var singleTickets = afterPagingTickets.Where(ticket => !ticket.IsMixParlay && ticket.GroupName != "Others").ToList();

        var groups = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
        if (creditParlayTickets.Any())
        {
            groups.Add(new Group<GetTicketModel> { Name = GroupTicket.Credit, Tickets = creditParlayTickets });
        }
        if (depositParlayTickets.Any())
        {
            groups.Add(new Group<GetTicketModel> { Name = GroupTicket.Deposit, Tickets = depositParlayTickets });
        }
        if (othersTickets.Any())
        {
            groups.Add(new Group<GetTicketModel> { Name = "Others", Tickets = othersTickets });
        }

        CountAllTicketsForGroup(originTickets, groups);

        return groups;
    }

    private static bool IsParlayTicketsPoolHouse(bool isMixParlay, string groupName)
    {
        return groupName is GroupTicket.Credit or GroupTicket.Deposit && isMixParlay;
    }

    private static void CountAllTicketsForGroup(IEnumerable<GetTicketModel> originalTickets, IEnumerable<Group<GetTicketModel>> outputGroups)
    {
        foreach (var group in outputGroups)
        {
            var total = originalTickets.Count(x => x.GroupName.Equals(group.Name, StringComparison.CurrentCultureIgnoreCase));
            group.DisplayTotalTickets = total;
        }
    }

    private Group<TicketViewModel> MapToGroupTicketViewModel(Group<GetTicketModel> group, int issueTypeId)
    {
        var tickets = new List<TicketViewModel>();

        foreach (var item in group.Tickets)
        {
            var ticket = mapTicketsService.MapFromGetTicketModelToTicketViewModel(item, null, ChoiceType.None, issueTypeId);
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
}