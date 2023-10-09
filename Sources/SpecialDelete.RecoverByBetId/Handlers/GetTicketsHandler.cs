using MediatR;
using SpecialDelete.RecoverByBetId.Models;
using SpecialDelete.RecoverByBetId.Services.GetTickets;
using SpecialDelete.RecoverByBetId.ViewModels;
using TicketVoidingSystem.Services;

namespace SpecialDelete.RecoverByBetId.Handlers;

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
        var model = await getTicketsService.GetTickets(request);
        var viewModel = new TicketsViewModel
        {
            InvalidTransIds = model.InvalidTransIds,
            MovedTransIds = model.MovedTransIds
        };
        var groups = pagingService.Groups(model.Tickets, ticket => ticket.GroupName);
        foreach (var group in groups)
        {
            viewModel.Groups.Add(await getTicketsService.GetViewModel(group));
        }

        return viewModel;
    }
}