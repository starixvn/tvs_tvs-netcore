using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets;

public class AllMarkedTicketsRequest : AllMarkedTicketsQuery, IRequest<AllMarkedTicketsViewModel>
{
}

public class AllMarkedTicketsHandler : IRequestHandler<AllMarkedTicketsRequest, AllMarkedTicketsViewModel>
{
    private readonly GetTicketsService getTicketsService;
    private readonly PagingService pagingService;
    private readonly RemotingRefWrapperService remotingRefWrapperService;

    public AllMarkedTicketsHandler(
        GetTicketsService getTicketsService,
        PagingService pagingService,
        RemotingRefWrapperService remotingRefWrapperService)
    {
        this.getTicketsService = getTicketsService;
        this.pagingService = pagingService;
        this.remotingRefWrapperService = remotingRefWrapperService;
    }

    public async Task<AllMarkedTicketsViewModel> Handle(AllMarkedTicketsRequest request, CancellationToken cancellationToken)
    {
        var viewModel = new AllMarkedTicketsViewModel();
        var items = await getTicketsService.GetAllMarkedTickets(request);
        viewModel.TotalItems = items.Count();
        viewModel.TicketList = CreateMapToTicketsViewModel(items, request);

        return viewModel;
    }

    private IEnumerable<AllMarkedTicketViewModel> CreateMapToTicketsViewModel(in IEnumerable<AllMarkedTicketModel> items, in AllMarkedTicketsRequest request)
    {
        var pagingItems = pagingService.Paging(items, request.PageIndex, request.PageSize);
        var index = 1;
        return pagingItems.Select(itemModel => new AllMarkedTicketViewModel
        {
            No = index++,
            IsChecked = true,
            UserId = itemModel.UserId,
            Username = itemModel.Username,
            MatchId = itemModel.MatchId,
            HTScore = itemModel.HTScore,
            FTScore = itemModel.FTScore,
            KickOffTime = itemModel.KickOffTime,
            CreatedDate = itemModel.CreatedDate,
            Total = itemModel.Total,
            Event = remotingRefWrapperService.GetTeamName(itemModel.HomeId, LanguageCode.English)
                    + "- vs -" + remotingRefWrapperService.GetTeamName(itemModel.AwayId, LanguageCode.English)
        });
    }
}