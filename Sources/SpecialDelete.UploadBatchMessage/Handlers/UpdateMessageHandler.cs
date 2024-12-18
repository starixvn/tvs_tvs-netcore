using MediatR;
using SpecialDelete.UploadBatchMessage.Models;
using SpecialDelete.UploadBatchMessage.Services;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace SpecialDelete.UploadBatchMessage.Handlers;

public class UpdateMessageRequest : UpdateMessageQueryModel, IRequest<Result>;

public class UpdateMessageHandler(
    BatchMessageService batchMessageService,
    SessionService sessionService)
    : IRequestHandler<UpdateMessageRequest, Result>
{
    public async Task<Result> Handle(UpdateMessageRequest request, CancellationToken cancellationToken)
    {
        request.Message.CreatorId = sessionService.UserId;
        request.Message.CreatorName = sessionService.UserName;
        return await batchMessageService.UpdateMessage(request);
    }
}