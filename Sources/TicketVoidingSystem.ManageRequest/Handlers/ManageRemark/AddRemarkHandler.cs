using MediatR;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRemark;

public class AddRemark : AddRemarkQuery, IRequest<Result>;

public class AddRemarkHandler(ResultCacheService resultCacheService, AddRemarkService addRemarkService)
    : IRequestHandler<AddRemark, Result>
{
    public async Task<Result> Handle(AddRemark request, CancellationToken cancellationToken)
    {
        if (await resultCacheService.IsExistResult(request.Guid))
        {
            return new Result { ErrorCode = 1, ErrorMsg = "Duplicated Firefox Request" };
        }

        var result = new Result();

        await resultCacheService.SetSimpleResultCache(request.Guid, result);
        result = await addRemarkService.Execute(request);
        await resultCacheService.SetSimpleResultCache(request.Guid, result);

        return result;
    }
}