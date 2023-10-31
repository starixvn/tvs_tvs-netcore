using MediatR;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.GetTickets;
using SpecialDelete.VoidByBetId.ViewModels;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace SpecialDelete.VoidByBetId.Handlers;

public class GetTicketsRequest : GetTicketsQuery, IRequest<TicketsViewModel>
{
}

public class GetTicketsHandler : IRequestHandler<GetTicketsRequest, TicketsViewModel>
{
    private readonly GetTicketsService getTicketsService;
    private readonly PagingService pagingService;

    public GetTicketsHandler(
        GetTicketsService getTicketsService,
        PagingService pagingService)
    {
        this.getTicketsService = getTicketsService;
        this.pagingService = pagingService;
    }

    public async Task<TicketsViewModel> Handle(GetTicketsRequest request, CancellationToken cancellationToken)
    {
        var isVoidByBetId = string.IsNullOrWhiteSpace(request.CustId);
        var viewModel = new TicketsViewModel();
        var (tickets, invalidTransIds, movedTransIds) = await getTicketsService.GetTickets(request);
        var groups = GenerateGroup(tickets.ToList());
        foreach (var item in groups)
        {
            viewModel.Groups.Add(await getTicketsService.AssignData(item, isVoidByBetId));
        }
        UpdateViewModel(viewModel, tickets, invalidTransIds, movedTransIds);

        return viewModel;
    }

    private IEnumerable<Group<GetTicketModel>> GenerateGroup(IReadOnlyCollection<GetTicketModel> tickets)
    {
        var groups = new List<Group<GetTicketModel>>();
        if (tickets.Any())
        {
            var parlayTickets = tickets.Where(ticket => ticket.BetType.IsParlayAndBetBuilder())
                .OrderBy(ticket => ticket.TransId).ToList();
            var singleTickets = tickets.Where(ticket => !ticket.BetType.IsParlayAndBetBuilder()).ToList();
            groups = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
            AddParlayGroup(groups, parlayTickets);
        }

        return groups;
    }

    private static void AddParlayGroup(List<Group<GetTicketModel>> groups, List<GetTicketModel> parlayTickets)
    {
        if (parlayTickets.Count > 0)
        {
            groups.Add(new Group<GetTicketModel> { Name = "Parlay", Tickets = parlayTickets });
        }
    }

    private static void UpdateViewModel(TicketsViewModel viewModel, IEnumerable<GetTicketModel> tickets, string invalidTransIds, string movedTransIds)
    {
        viewModel.InvalidTransIds = invalidTransIds;
        viewModel.MovedTransIds = movedTransIds;
        viewModel.TotalItem = tickets.Count();

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
        if (tickets.Any())
        {
            viewModel.FromTime = tickets.Min(item => item.TransDate).ZoneManila().ToString("hh:mm:ss tt");
            viewModel.ToTime = tickets.Max(item => item.TransDate).ZoneManila().ToString("hh:mm:ss tt");
            viewModel.FromDate = tickets.Min(item => item.WinLostDate).ZoneManila().ToString("MM/dd/yyyy");
            viewModel.ToDate = tickets.Max(item => item.WinLostDate).ZoneManila().ToString("MM/dd/yyyy");
        }
    }
}