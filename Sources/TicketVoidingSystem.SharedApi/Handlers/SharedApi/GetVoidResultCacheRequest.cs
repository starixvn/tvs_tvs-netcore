using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class GetVoidResultCacheRequest : IRequest<IList<Result>>
{
    public string Guid { get; set; }
}

public class GetVoidResultCacheHandler(ResultCacheService resultCacheService)
    : IRequestHandler<GetVoidResultCacheRequest, IList<Result>>
{
    public async Task<IList<Result>> Handle(GetVoidResultCacheRequest request, CancellationToken cancellationToken)
    {
        return await resultCacheService.GetVoidResultsCache(request.Guid);
    }
}