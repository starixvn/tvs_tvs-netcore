using MediatR;
using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.Services.GetTickets;
using SpecialDelete.RecoverParlayBet.ViewModels;
using TicketVoidingSystem.Constants;

namespace SpecialDelete.RecoverParlayBet.Handlers;

public class GetMainTicketsRequest : GetMainTicketsQuery, IRequest<TicketsViewModel>
{
}

public class GetMainTicketsHandler(GetTicketsService<GetMainTicket, GetMainTicketsQuery> getTicketsService)
    : IRequestHandler<GetMainTicketsRequest, TicketsViewModel>
{
    public async Task<TicketsViewModel> Handle(GetMainTicketsRequest request, CancellationToken cancellationToken)
    {
        return await getTicketsService.GetTickets(request, BetTypeConstant.SystemParlay);
    }
}