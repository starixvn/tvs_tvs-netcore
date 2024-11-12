using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Models;
using TicketVoidingSystem.SharedApi.Services.SharedApi;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class GetGroupLicenseesRequest : IRequest<IEnumerable<GroupLicensee>>
{
}

public class GetGroupLicenseesHandler(FilterCurrencyLicenseeService filterCurrencyLicenseeService)
    : IRequestHandler<GetGroupLicenseesRequest, IEnumerable<GroupLicensee>>
{
    public async Task<IEnumerable<GroupLicensee>> Handle(GetGroupLicenseesRequest request, CancellationToken cancellationToken)
    {
        return await filterCurrencyLicenseeService.GetGroupLicensees();
    }
}