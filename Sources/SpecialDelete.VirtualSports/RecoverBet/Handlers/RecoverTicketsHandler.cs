using MediatR;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Services;
using TicketVoidingSystem.Models;

namespace SpecialDelete.VirtualSports.RecoverBet.Handlers;

public class RecoverTicketsRequest : Query, IRequest<IEnumerable<Result>>;

public class RecoverTicketsHandler(RecoverBetService service)
    : IRequestHandler<RecoverTicketsRequest, IEnumerable<Result>>
{
    public async Task<IEnumerable<Result>> Handle(RecoverTicketsRequest request, CancellationToken cancellationToken)
    {
        return await service.RecoverTickets(request);
    }
}