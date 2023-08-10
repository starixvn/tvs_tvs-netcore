using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class AddRequest : AddRequestQuery, IRequest<Result>
{
}

public class AddRequestHandler : IRequestHandler<AddRequest, Result>
{
    private readonly ResultCacheService resultCacheService;
    private readonly AddRequestService addRequestService;

    public AddRequestHandler(ResultCacheService resultCacheService, AddRequestService addRequestService)
    {
        this.resultCacheService = resultCacheService;
        this.addRequestService = addRequestService;
    }

    public async Task<Result> Handle(AddRequest request, CancellationToken cancellationToken)
    {
        if (await resultCacheService.IsExistResult(request.Guid))
        {
            return new Result { ErrorCode = 1, ErrorMsg = "Duplicated Firefox Request" };
        }

        var result = new Result();
        await resultCacheService.SetSimpleResultCache(request.Guid, result);
        result = await addRequestService.Execute(request);
        await resultCacheService.SetSimpleResultCache(request.Guid, result);

        return result;
    }
}