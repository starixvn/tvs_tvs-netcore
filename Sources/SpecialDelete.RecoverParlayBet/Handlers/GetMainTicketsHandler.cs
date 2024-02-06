using MediatR;
using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.Services.GetTickets;
using SpecialDelete.RecoverParlayBet.ViewModels;
using TicketVoidingSystem.Constants;

namespace SpecialDelete.RecoverParlayBet.Handlers;

public class GetMainTicketsRequest : GetMainTicketsQuery, IRequest<TicketsViewModel>
{
}

public class GetMainTicketsHandler : IRequestHandler<GetMainTicketsRequest, TicketsViewModel>
{
    private readonly GetTicketsService<GetMainTicket, GetMainTicketsQuery> getTicketsService;

    public GetMainTicketsHandler(GetTicketsService<GetMainTicket, GetMainTicketsQuery> getTicketsService)
    {
        this.getTicketsService = getTicketsService;
    }

    public async Task<TicketsViewModel> Handle(GetMainTicketsRequest request, CancellationToken cancellationToken)
    {
        return await getTicketsService.GetTickets(request, BetTypeConstant.SystemParlay);
    }
}