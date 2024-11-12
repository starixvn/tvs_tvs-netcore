using MediatR;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.GetTickets;
using SpecialDelete.VirtualSports.VoidParlaySub.ViewModels;
using TicketVoidingSystem.Services;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Handlers;

public class GetTicketsRequest : GetTicketsQuery, IRequest<TicketsViewModel>
{
}

public class GetTicketsHandler(
    GetTicketsService getTicketsService,
    PagingService pagingService)
    : IRequestHandler<GetTicketsRequest, TicketsViewModel>
{
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