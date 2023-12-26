using MediatR;
using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.Services.RecoverTickets;
using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverParlayBet.Handlers;

public class RecoverSubTicketsRequest : RecoverSubTicketsQuery, IRequest<IEnumerable<Result>>
{
}

public class RecoverSubTicketsHandler : IRequestHandler<RecoverSubTicketsRequest, IEnumerable<Result>>
{
    private readonly RecoverTicketsService<RecoverSubTicketModel, RecoverSubTicketsQuery> recoverTicketsService;

    public RecoverSubTicketsHandler(RecoverTicketsService<RecoverSubTicketModel, RecoverSubTicketsQuery> recoverTicketsService)
    {
        this.recoverTicketsService = recoverTicketsService;
    }

    public async Task<IEnumerable<Result>> Handle(RecoverSubTicketsRequest request, CancellationToken cancellationToken)
    {
        return await recoverTicketsService.Recover(request);
    }
}