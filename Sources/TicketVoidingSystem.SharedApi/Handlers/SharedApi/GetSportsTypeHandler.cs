using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.SharedApi.Models;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class GetSportsTypeRequest : IRequest<IEnumerable<SportInfo>>
{
}

public class GetSportsTypeHandler(IDynamicRepository repository)
    : IRequestHandler<GetSportsTypeRequest, IEnumerable<SportInfo>>
{
    public async Task<IEnumerable<SportInfo>> Handle(GetSportsTypeRequest request, CancellationToken cancellationToken)
    {
        var sport = await repository.FetchAsync<SportInfo>(new GetSportsTypeCriteria());
        return sport.OrderBy(x => x.SportType);
    }
}