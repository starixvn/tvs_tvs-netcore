using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;

namespace TicketVoidingSystem.TicketListing.Handlers;

public class GetLicenseesRequest : IRequest<IEnumerable<Licensee>>
{
}

public class GetLicenseesHandler : IRequestHandler<GetLicenseesRequest, IEnumerable<Licensee>>
{
    private readonly IDynamicRepository repository;

    public GetLicenseesHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<Licensee>> Handle(GetLicenseesRequest request, CancellationToken cancellationToken)
    {
        var criteria = new GetLicenseesCriteria();
        return await repository.FetchAsync<Licensee>(criteria, cancellationToken);
    }
}