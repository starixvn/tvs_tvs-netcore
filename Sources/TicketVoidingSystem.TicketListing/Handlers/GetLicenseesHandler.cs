using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;

namespace TicketVoidingSystem.TicketListing.Handlers;

public class GetLicenseesRequest : IRequest<IEnumerable<Licensee>>
{
}

public class GetLicenseesHandler(IDynamicRepository repository)
    : IRequestHandler<GetLicenseesRequest, IEnumerable<Licensee>>
{
    public async Task<IEnumerable<Licensee>> Handle(GetLicenseesRequest request, CancellationToken cancellationToken)
    {
        var criteria = new GetLicenseesCriteria();
        return await repository.FetchAsync<Licensee>(criteria);
    }
}