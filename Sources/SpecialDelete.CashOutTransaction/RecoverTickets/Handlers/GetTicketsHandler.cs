using MediatR;
using SpecialDelete.CashOutTransaction.Common.Models;
using SpecialDelete.CashOutTransaction.Common.ViewModels;
using SpecialDelete.CashOutTransaction.RecoverTickets.Services;

namespace SpecialDelete.CashOutTransaction.RecoverTickets.Handlers;

public class GetTicketsRequest : GetTicketsQuery, IRequest<TicketsViewModel<TicketViewModel>>
{
}

public class GetTicketsHandler : IRequestHandler<GetTicketsRequest, TicketsViewModel<TicketViewModel>>
{
    private readonly HandlerService cashOutService;

    public GetTicketsHandler(HandlerService cashOutService)
    {
        this.cashOutService = cashOutService;
    }

    public async Task<TicketsViewModel<TicketViewModel>> Handle(GetTicketsRequest request, CancellationToken cancellationToken)
    {
        return await cashOutService.GetTickets(request);
    }
}