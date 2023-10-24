using MediatR;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Services;
using TicketVoidingSystem.Models;

namespace SpecialDelete.VoidByCurrency.Handlers;

public class VoidTicketsRequest : VoidTicketsQuery, IRequest<IEnumerable<Result>>
{
}

public class VoidTicketsHandler : IRequestHandler<VoidTicketsRequest, IEnumerable<Result>>
{
    private readonly VoidByCurrencyService voidByCurrencyService;

    public VoidTicketsHandler(VoidByCurrencyService voidByCurrencyService)
    {
        this.voidByCurrencyService = voidByCurrencyService;
    }

    public async Task<IEnumerable<Result>> Handle(VoidTicketsRequest request, CancellationToken cancellationToken)
    {
        return await voidByCurrencyService.VoidBet(request);
    }
}