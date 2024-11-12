using MediatR;
using SpecialDelete.CashOutTransaction.CancelCashOut.Services;
using SpecialDelete.CashOutTransaction.Common.Models;
using SpecialDelete.CashOutTransaction.Common.ViewModels;

namespace SpecialDelete.CashOutTransaction.CancelCashOut.Handlers;

public class GetTicketsRequest : GetTicketsQuery, IRequest<TicketsViewModel<TicketViewModel>>
{
}

public class GetTicketsHandler(HandlerService cashOutService)
    : IRequestHandler<GetTicketsRequest, TicketsViewModel<TicketViewModel>>
{
    public async Task<TicketsViewModel<TicketViewModel>> Handle(GetTicketsRequest request, CancellationToken cancellationToken)
    {
        return await cashOutService.GetTickets(request);
    }
}