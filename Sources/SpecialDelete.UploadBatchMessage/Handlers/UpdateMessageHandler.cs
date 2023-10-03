using MediatR;
using SpecialDelete.UploadBatchMessage.Models;
using SpecialDelete.UploadBatchMessage.Services;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace SpecialDelete.UploadBatchMessage.Handlers;

public class UpdateMessageRequest : UpdateMessageQueryModel, IRequest<Result>
{
}

public class UpdateMessageHandler : IRequestHandler<UpdateMessageRequest, Result>
{
    private readonly BatchMessageService batchMessageService;
    private readonly SessionService sessionService;

    public UpdateMessageHandler(
        BatchMessageService batchMessageService,
        SessionService sessionService)
    {
        this.batchMessageService = batchMessageService;
        this.sessionService = sessionService;
    }

    public async Task<Result> Handle(UpdateMessageRequest request, CancellationToken cancellationToken)
    {
        request.Message.CreatorId = sessionService.UserId;
        request.Message.CreatorName = sessionService.UserName;
        return await batchMessageService.UpdateMessage(request);
    }
}