using MediatR;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Services;
using TicketVoidingSystem.Models;

namespace SpecialDelete.VirtualSports.RecoverBet.Handlers;

public class RecoverTicketsRequest : Query, IRequest<IEnumerable<Result>>
{
}

public class RecoverTicketsHandler : IRequestHandler<RecoverTicketsRequest, IEnumerable<Result>>
{
    private readonly RecoverBetService service;

    public RecoverTicketsHandler(RecoverBetService service)
    {
        this.service = service;
    }

    public async Task<IEnumerable<Result>> Handle(RecoverTicketsRequest request, CancellationToken cancellationToken)
    {
        return await service.RecoverTickets(request);
    }
}