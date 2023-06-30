using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetLinkedLogRequest : GetLinkedLogModel, IRequest<LinkedLogDataViewModel>
{
}

public class GetLinkedLogHandler : IRequestHandler<GetLinkedLogRequest, LinkedLogDataViewModel>
{
    private readonly GetLinkedLogService getLinkedLogService;

    public GetLinkedLogHandler(GetLinkedLogService getLinkedLogService)
    {
        this.getLinkedLogService = getLinkedLogService;
    }

    public async Task<LinkedLogDataViewModel> Handle(GetLinkedLogRequest request, CancellationToken cancellationToken)
    {
        return await getLinkedLogService.GetLinkedLog(request);
    }
}