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

    // Jacob, đọc hàm này thấy hơi mệt mệt nha
    // Cần tách hàm ra nhỏ hơn
    // Cần đo lại performance của hàm này, vì nó có 1 cái loop gọi 1 hàm khác, mà hàm khác cũng có loop nữa
    public async Task<VoidedTicketsViewModel> Handle(GetVoidedTicketsRequest request, CancellationToken cancellationToken)
    {
        
        var voidedTickets = await getVoidedTicketsService.GetTickets(request);
        var viewModel = new VoidedTicketsViewModel
        {
            TotalVoidedTickets = voidedTickets.Count(x => !x.IsCancelCashOut),
            TotalCancelCashOut = voidedTickets.Count(x => x.IsCancelCashOut),
            LicenseeNames = CombineLicensee(voidedTickets)
        };

        var match = request.MatchId != null && request.MatchId != 0 ? await getVoidedTicketsService.GetMatchInfo(request.MatchId.Value) : null;
        var groups = mapTicketsService.MapToGroupVoidedTickets(voidedTickets, request);
        var index = (request.PageIndex * request.PageSize) + 1;
        // Jacob đừng để Where trong foreach, đọc rối lắm, khai báo biến bên ngoài đi
        foreach (var item in groups.Where(item => item.Tickets.Any()))
        {
            var currentGroup = mapTicketsService.MapToGroupVoidedTicketsViewModel(item, match, index, request.IssueTypeId);
            viewModel.Groups.Add(currentGroup);
            index += currentGroup.Tickets.Count();
        }

        UpdateGeneralBetType(request, viewModel);

        return viewModel;
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