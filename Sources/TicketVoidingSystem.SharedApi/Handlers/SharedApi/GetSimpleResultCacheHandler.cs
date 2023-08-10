using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class GetSimpleResultCacheRequest : IRequest<Result>
{
    public string Guid { get; set; }
}

public class GetSimpleResultCacheHandler : IRequestHandler<GetSimpleResultCacheRequest, Result>
{
    private readonly ResultCacheService resultCacheService;

    public GetSimpleResultCacheHandler(ResultCacheService resultCacheService)
    {
        this.resultCacheService = resultCacheService;
    }

    public async Task<Result> Handle(GetSimpleResultCacheRequest request, CancellationToken cancellationToken)
    {
        return await resultCacheService.GetSimpleResultCache(request.Guid);
    }
}