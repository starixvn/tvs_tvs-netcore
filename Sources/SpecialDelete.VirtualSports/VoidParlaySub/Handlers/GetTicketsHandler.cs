using MediatR;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.GetTickets;
using SpecialDelete.VirtualSports.VoidParlaySub.ViewModels;
using TicketVoidingSystem.Services;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Handlers;

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
        var viewModel = new TicketsViewModel();
        var model = await getTicketsService.ExecuteQuery(request);
        var pagingTickets = pagingService.Paging(model.Tickets, request.PageIndex, request.PageSize);
        var groups = pagingService.Groups(pagingTickets, ticket => ticket.GroupName);
        foreach (var group in groups)
        {
            viewModel.Groups.Add(await getTicketsService.AssignData(group));
        }

        viewModel.TotalItems = model.Tickets.Count;
        viewModel.InvalidTransIds = model.InvalidTransIds;

        return viewModel;
    }
}