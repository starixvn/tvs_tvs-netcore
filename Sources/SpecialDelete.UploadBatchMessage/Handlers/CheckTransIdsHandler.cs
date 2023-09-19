using MediatR;
using SpecialDelete.UploadBatchMessage.Models;
using SpecialDelete.UploadBatchMessage.Services;

namespace SpecialDelete.UploadBatchMessage.Handlers;

public class CheckTransIdsRequest : CheckTransIdsQueryModel, IRequest<MessageResult>
{
}

public class CheckTransIdsHandler : IRequestHandler<CheckTransIdsRequest, MessageResult>
{
    private readonly BatchMessageService batchMessageService;

    public CheckTransIdsHandler(BatchMessageService batchMessageService)
    {
        this.batchMessageService = batchMessageService;
    }

    public async Task<MessageResult> Handle(CheckTransIdsRequest request, CancellationToken cancellationToken)
    {
        return await batchMessageService.GetReceivedUsers(request);
    }
}