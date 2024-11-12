using MediatR;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Services;
using SpecialDelete.VoidByCurrency.ViewModels;

namespace SpecialDelete.VoidByCurrency.Handlers;

public class GetTicketsRequest : GetTicketsQuery, IRequest<TicketsViewModel>
{
}

public class GetTicketsHandler(VoidByCurrencyService voidByCurrencyService)
    : IRequestHandler<GetTicketsRequest, TicketsViewModel>
{
    public async Task<TicketsViewModel> Handle(GetTicketsRequest request, CancellationToken cancellationToken)
    {
        return await voidByCurrencyService.GetTickets(request);
    }
}