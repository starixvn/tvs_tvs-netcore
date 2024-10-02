using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Models;
using TicketVoidingSystem.SharedApi.Services.SharedApi;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class GetCurrenciesRequest : IRequest<IEnumerable<Currency>>
{
}

public class GetCurrenciesHandler : IRequestHandler<GetCurrenciesRequest, IEnumerable<Currency>>
{
    private readonly FilterCurrencyLicenseeService filterCurrencyLicenseeService;

    public GetCurrenciesHandler(FilterCurrencyLicenseeService filterCurrencyLicenseeService)
    {
        this.filterCurrencyLicenseeService = filterCurrencyLicenseeService;
    }

    public async Task<IEnumerable<Currency>> Handle(GetCurrenciesRequest request, CancellationToken cancellationToken)
    {
        return await filterCurrencyLicenseeService.GetCurrencies();
    }
}