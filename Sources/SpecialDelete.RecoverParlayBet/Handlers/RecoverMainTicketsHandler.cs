using MediatR;
using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.Services.RecoverTickets;
using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverParlayBet.Handlers;

public class RecoverMainTicketsRequest : RecoverMainTicketsQuery, IRequest<IEnumerable<Result>>
{
}

public class RecoverMainTicketsHandler : IRequestHandler<RecoverMainTicketsRequest, IEnumerable<Result>>
{
    private readonly RecoverTicketsService<RecoverMainTicketModel, RecoverMainTicketsQuery> recoverTicketsService;

    public RecoverMainTicketsHandler(RecoverTicketsService<RecoverMainTicketModel, RecoverMainTicketsQuery> recoverTicketsService)
    {
        this.recoverTicketsService = recoverTicketsService;
    }

    public async Task<IEnumerable<Result>> Handle(RecoverMainTicketsRequest request, CancellationToken cancellationToken)
    {
        return await recoverTicketsService.Recover(request);
    }
}