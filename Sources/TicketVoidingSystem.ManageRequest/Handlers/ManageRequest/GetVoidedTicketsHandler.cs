using MediatR;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class GetVoidedTicketsRequest : GetVoidedTicketsQuery, IRequest<VoidedTicketsViewModel>
{
}

public class GetVoidedTicketsHandler : IRequestHandler<GetVoidedTicketsRequest, VoidedTicketsViewModel>
{
    private readonly GetVoidedTicketsService getVoidedTicketsService;
    private readonly MapTicketsService mapTicketsService;

    public GetVoidedTicketsHandler(
        GetVoidedTicketsService getVoidedTicketsService,
        MapTicketsService mapTicketsService)
    {
        this.getVoidedTicketsService = getVoidedTicketsService;
        this.mapTicketsService = mapTicketsService;
    }

    public async Task<VoidedTicketsViewModel> Handle(GetVoidedTicketsRequest request, CancellationToken cancellationToken)
    {
        var voidedTickets = await getVoidedTicketsService.GetTickets(request);
        var viewModel = new VoidedTicketsViewModel
        {
            TotalVoidedTickets = voidedTickets.Count(x => !x.IsCancelCashOut),
            TotalCancelCashOut = voidedTickets.Count(x => x.IsCancelCashOut),
            LicenseeNames = CombineLicensee(voidedTickets),
            Groups = new List<Group<VoidedTicketViewModel>>()
        };

        await UpdateGroupTickets(viewModel, request, voidedTickets);
        UpdateGeneralBetType(request, viewModel);

        return viewModel;
    }

    private async Task UpdateGroupTickets(VoidedTicketsViewModel viewModel, GetVoidedTicketsQuery query, IEnumerable<VoidedTicketModel> voidedTickets)
    {
        var match = query.MatchId != null && query.MatchId != 0 ? await getVoidedTicketsService.GetMatchInfo(query.MatchId.Value) : null;
        var groups = mapTicketsService.MapToGroupVoidedTickets(voidedTickets, query).Where(item => item.Tickets.Any());
        var index = (query.PageIndex * query.PageSize) + 1;
        foreach (var group in groups)
        {
            var currentGroup = mapTicketsService.MapToGroupVoidedTicketsViewModel(group, match, index, query.IssueTypeId);
            viewModel.Groups.Add(currentGroup);
            index += currentGroup.Tickets.Count();
        }
    }

    private static string CombineLicensee(IEnumerable<VoidedTicketModel> tickets)
    {
        var licensees = tickets.Where(item => item.GroupName.IndexOf("Deposit", StringComparison.CurrentCultureIgnoreCase) >= 0)
            .Select(item => item.LicenseeName).Distinct();

        return string.Join(", ", licensees);
    }

    private static void UpdateGeneralBetType(GetVoidedTicketsQuery query, VoidedTicketsViewModel viewModel)
    {
        if (query.IssueTypeId.IsLikelyAbnormalBet())
        {
            viewModel.GeneralBetTypeCombinations = CombineBettype(viewModel.Groups);
        }
    }

    private static string CombineBettype(IEnumerable<Group<VoidedTicketViewModel>> groups)
    {
        var ticketsViewModels = groups.SelectMany(x => x.Tickets);
        var bettypeCombinations = ticketsViewModels.Select(x => x.BettypeCombination).Distinct();

        return string.Join(", ", bettypeCombinations);
    }
}