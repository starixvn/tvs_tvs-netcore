using MediatR;
using SpecialDelete.CashOutTransaction.RecoverTickets.Models;
using SpecialDelete.CashOutTransaction.RecoverTickets.Services;
using TicketVoidingSystem.Models;

namespace SpecialDelete.CashOutTransaction.RecoverTickets.Handlers;

public class RecoverTicketsRequest : RecoverTicketsQuery, IRequest<List<Result>>
{
}

public class RecoverTicketsHandler : IRequestHandler<RecoverTicketsRequest, List<Result>>
{
    private readonly HandlerService cashOutService;

    public RecoverTicketsHandler(HandlerService cashOutService)
    {
        this.cashOutService = cashOutService;
    }

    public async Task<List<Result>> Handle(RecoverTicketsRequest request, CancellationToken cancellationToken)
    {
        return await cashOutService.RecoverTickets(request);
    }
}