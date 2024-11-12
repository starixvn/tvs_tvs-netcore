using MediatR;
using SpecialDelete.UploadBatchMessage.Models;
using SpecialDelete.UploadBatchMessage.Services;

namespace SpecialDelete.UploadBatchMessage.Handlers;

public class CheckTransIdsRequest : CheckTransIdsQueryModel, IRequest<MessageResult>
{
}

public class CheckTransIdsHandler(BatchMessageService batchMessageService)
    : IRequestHandler<CheckTransIdsRequest, MessageResult>
{
    public async Task<MessageResult> Handle(CheckTransIdsRequest request, CancellationToken cancellationToken)
    {
        return await batchMessageService.GetReceivedUsers(request);
    }
}