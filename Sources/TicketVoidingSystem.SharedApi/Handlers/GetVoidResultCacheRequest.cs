using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.SharedApi.Handlers;

public class GetVoidResultCacheRequest : IRequest<IList<Result>>
{
    public string Guid { get; set; }
}

public class GetVoidResultCacheHandler : IRequestHandler<GetVoidResultCacheRequest, IList<Result>>
{
    private readonly VoidResultCacheService voidResultCacheService;

    public GetVoidResultCacheHandler(VoidResultCacheService voidResultCacheService)
    {
        this.voidResultCacheService = voidResultCacheService;
    }

    public async Task<IList<Result>> Handle(GetVoidResultCacheRequest request, CancellationToken cancellationToken)
    {
        return await voidResultCacheService.GetVoidResultCache(request.Guid);
    }
}