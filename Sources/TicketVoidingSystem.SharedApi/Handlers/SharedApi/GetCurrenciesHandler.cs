using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Models;
using TicketVoidingSystem.SharedApi.Services.SharedApi;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class GetCurrenciesRequest : IRequest<IEnumerable<Currency>>;

public class GetCurrenciesHandler(FilterCurrencyLicenseeService filterCurrencyLicenseeService)
    : IRequestHandler<GetCurrenciesRequest, IEnumerable<Currency>>
{
    public async Task<IEnumerable<Currency>> Handle(GetCurrenciesRequest request, CancellationToken cancellationToken)
    {
        return await filterCurrencyLicenseeService.GetCurrencies();
    }
}