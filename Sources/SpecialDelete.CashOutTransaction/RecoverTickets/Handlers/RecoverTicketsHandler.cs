using MediatR;
using SpecialDelete.CashOutTransaction.RecoverTickets.Models;
using SpecialDelete.CashOutTransaction.RecoverTickets.Services;
using TicketVoidingSystem.Models;

namespace SpecialDelete.CashOutTransaction.RecoverTickets.Handlers;

public class RecoverTicketsRequest : RecoverTicketsQuery, IRequest<List<Result>>;

public class RecoverTicketsHandler(HandlerService cashOutService) : IRequestHandler<RecoverTicketsRequest, List<Result>>
{
    public async Task<List<Result>> Handle(RecoverTicketsRequest request, CancellationToken cancellationToken)
    {
        return await cashOutService.RecoverTickets(request);
    }
}