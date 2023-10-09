using MediatR;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Services;
using SpecialDelete.VirtualSports.RecoverBet.ViewModels;

namespace SpecialDelete.VirtualSports.RecoverBet.Handlers;

public class GetTicketsRequest : Query, IRequest<RecoverTicketsViewModel>
{
}

public class GetTicketsHandler : IRequestHandler<GetTicketsRequest, RecoverTicketsViewModel>
{
    private readonly RecoverBetService service;

    public GetTicketsHandler(RecoverBetService service)
    {
        this.service = service;
    }

    public async Task<RecoverTicketsViewModel> Handle(GetTicketsRequest request, CancellationToken cancellationToken)
    {
        return await service.GetTickets(request);
    }
}