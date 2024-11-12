using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.ABExceptionList.Models;

namespace TicketVoidingSystem.ABExceptionList.Handlers;

public class GetSitesRequest : GetSitesCriteria, IRequest<IEnumerable<GroupLicenseeSiteViewModel>>
{
}

public class GetSitesHandler(IDynamicRepository repository)
    : IRequestHandler<GetSitesRequest, IEnumerable<GroupLicenseeSiteViewModel>>
{
    public async Task<IEnumerable<GroupLicenseeSiteViewModel>> Handle(GetSitesRequest request, CancellationToken cancellationToken)
    {
        var data = await repository.FetchAsync<LicenseeSite>(request);
        return data.GroupBy(b => b.GroupName).Select(group => new GroupLicenseeSiteViewModel { GroupName = group.Key, Sites = group });
    }
}