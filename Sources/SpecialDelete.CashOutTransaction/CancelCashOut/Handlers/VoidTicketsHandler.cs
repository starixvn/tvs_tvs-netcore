using MediatR;
using SpecialDelete.CashOutTransaction.CancelCashOut.Models;
using SpecialDelete.CashOutTransaction.CancelCashOut.Services;
using TicketVoidingSystem.Models;

namespace SpecialDelete.CashOutTransaction.CancelCashOut.Handlers;

public class VoidTicketsRequest : VoidTicketsQuery, IRequest<List<Result>>
{
}

public class VoidTicketsHandler : IRequestHandler<VoidTicketsRequest, List<Result>>
{
    private readonly HandlerService cashOutService;

    public VoidTicketsHandler(HandlerService cashOutService)
    {
        this.cashOutService = cashOutService;
    }

    public async Task<List<Result>> Handle(VoidTicketsRequest request, CancellationToken cancellationToken)
    {
        return await cashOutService.VoidTickets(request);
    }
}