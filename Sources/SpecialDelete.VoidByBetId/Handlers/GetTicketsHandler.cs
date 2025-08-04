using MediatR;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.GetTickets;
using SpecialDelete.VoidByBetId.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace SpecialDelete.VoidByBetId.Handlers;

public class GetTicketsRequest : GetTicketsQuery, IRequest<TicketsViewModel>;

public class GetTicketsHandler(
    GetTicketsService getTicketsService,
    PagingService pagingService)
    : IRequestHandler<GetTicketsRequest, TicketsViewModel>
{
    public async Task<TicketsViewModel> Handle(GetTicketsRequest request, CancellationToken cancellationToken)
    {
        var viewModel = new TicketsViewModel();
        var (tickets, invalidTransIds, movedTransIds, matchId) = await getTicketsService.GetTickets(request);
        var groups = GenerateGroup(tickets.ToList());
        foreach (var item in groups)
        {
            viewModel.Groups.Add(await getTicketsService.AssignData(item));
        }
        UpdateViewModel(viewModel, tickets, invalidTransIds, movedTransIds);
        viewModel.MatchId = matchId;
        return viewModel;
    }

    private IEnumerable<Group<GetTicketModel>> GenerateGroup(IReadOnlyCollection<GetTicketModel> tickets)
    {
        if (!tickets.Any())
        {
            return [];
        }

        var parlayTickets = tickets.Where(ticket => ticket.BetType.IsParlayAndBetBuilder())
            .OrderBy(ticket => ticket.TransId).ToList();
        var singleTickets = tickets.Where(ticket => !ticket.BetType.IsParlayAndBetBuilder()).ToList();
        var creditParlayTickets = parlayTickets.Where(ticket => !ticket.IsDeposit).OrderBy(ticket => ticket.TransId).ToList();
        var depositParlayTickets = parlayTickets.Where(ticket => ticket.IsDeposit).OrderBy(ticket => ticket.TransId).ToList();

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

    private static void UpdateViewModel(TicketsViewModel viewModel, IEnumerable<GetTicketModel> tickets, string invalidTransIds, string movedTransIds)
    {
        viewModel.InvalidTransIds = invalidTransIds;
        viewModel.MovedTransIds = movedTransIds;
        viewModel.TotalItems = tickets.Count();

        UpdateTicketsInfo(viewModel, tickets);
    }

    private static void UpdateTicketsInfo(TicketsViewModel viewModel, IEnumerable<GetTicketModel> tickets)
    {
        var singleTickets = tickets.Where(item => !item.BetType.IsParlayAndBetBuilder());
        var parlayTickets = tickets.Where(item => item.BetType.IsParlayAndBetBuilder());
        viewModel.Tickets = tickets.Select(x => new BetId { TransId = x.TransId.ToString(), SiteDbGroupId = x.SiteDbGroupId, MatchId = x.MatchId });
        viewModel.SingleCount = singleTickets.Count();
        viewModel.ParlayCount = parlayTickets.Count();
        var licensees = tickets.Where(item => item.GroupName.ToLowerInvariant() == "deposit")
            .Select(item => item.LicenseeName).Distinct().ToArray();
        Array.Sort(licensees, StringComparer.InvariantCulture);
        viewModel.LicenseesName = string.Join(", ", licensees);
        UpdateTimeViewModel(viewModel, tickets);
    }

    private static void UpdateTimeViewModel(TicketsViewModel viewModel, IEnumerable<GetTicketModel> tickets)
    {
        if (!tickets.Any())
        {
            return;
        }

        viewModel.FromTransTime = tickets.Min(item => item.TransDate).ZoneManila();
        viewModel.ToTransTime = tickets.Max(item => item.TransDate).ZoneManila();
    }
}