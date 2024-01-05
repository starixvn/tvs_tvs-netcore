using MediatR;
using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.Services.GetTickets;
using SpecialDelete.RecoverParlayBet.ViewModels;

namespace SpecialDelete.RecoverParlayBet.Handlers;

public class GetSubTicketsRequest : GetSubTicketsQuery, IRequest<TicketsViewModel>
{
}

public class GetSubTicketsHandler : IRequestHandler<GetSubTicketsRequest, TicketsViewModel>
{
    private readonly GetTicketsService<GetSubTicket, GetSubTicketsQuery> getTicketsService;

    public GetSubTicketsHandler(GetTicketsService<GetSubTicket, GetSubTicketsQuery> getTicketsService)
    {
        this.getTicketsService = getTicketsService;
    }

    public async Task<TicketsViewModel> Handle(GetSubTicketsRequest request, CancellationToken cancellationToken)
    {
        return await getTicketsService.GetTickets(request);
    }
}