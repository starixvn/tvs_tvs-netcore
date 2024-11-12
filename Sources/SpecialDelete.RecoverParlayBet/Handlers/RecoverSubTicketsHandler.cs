using MediatR;
using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.Services.RecoverTickets;
using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverParlayBet.Handlers;

public class RecoverSubTicketsRequest : RecoverSubTicketsQuery, IRequest<IEnumerable<Result>>
{
}

public class RecoverSubTicketsHandler(
    RecoverTicketsService<RecoverSubTicketModel, RecoverSubTicketsQuery> recoverTicketsService)
    : IRequestHandler<RecoverSubTicketsRequest, IEnumerable<Result>>
{
    public async Task<IEnumerable<Result>> Handle(RecoverSubTicketsRequest request, CancellationToken cancellationToken)
    {
        return await recoverTicketsService.Recover(request);
    }
}