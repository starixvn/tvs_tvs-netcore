using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.MarkTickets.Criteria;
using TicketVoidingSystem.MarkTickets.Models;

namespace TicketVoidingSystem.MarkTickets.Handlers;

public class GetLicenseesRequest : GetLicenseesCriteria, IRequest<IEnumerable<GroupLicensee>>
{
}

public class GetLicenseesHandler : IRequestHandler<GetLicenseesRequest, IEnumerable<GroupLicensee>>
{
    private readonly IDynamicRepository repository;

    public GetLicenseesHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<GroupLicensee>> Handle(GetLicenseesRequest request, CancellationToken cancellationToken)
    {
        var licensees = await repository.FetchAsync<Licensee>(request);
        return licensees.GroupBy(b => b.GroupName)
            .Select(group => new GroupLicensee { GroupName = group.Key, Licensees = group });
    }
}