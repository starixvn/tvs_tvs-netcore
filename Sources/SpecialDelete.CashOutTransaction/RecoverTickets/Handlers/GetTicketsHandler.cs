using MediatR;
using SpecialDelete.CashOutTransaction.Common.Models;
using SpecialDelete.CashOutTransaction.Common.ViewModels;
using SpecialDelete.CashOutTransaction.RecoverTickets.Services;

namespace SpecialDelete.CashOutTransaction.RecoverTickets.Handlers;

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