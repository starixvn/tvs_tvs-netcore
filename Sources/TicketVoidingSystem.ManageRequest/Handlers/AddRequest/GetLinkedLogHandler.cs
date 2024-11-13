using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetLinkedLogRequest : GetLinkedLogModel, IRequest<LinkedLogDataViewModel>;

public class GetLinkedLogHandler(GetLinkedLogService getLinkedLogService)
    : IRequestHandler<GetLinkedLogRequest, LinkedLogDataViewModel>
{
    public async Task<LinkedLogDataViewModel> Handle(GetLinkedLogRequest request, CancellationToken cancellationToken)
    {
        try
        {
            return await getLinkedLogService.GetLinkedLogWhenSuccess(request);
        }
        catch (Exception exception)
        {
            return await getLinkedLogService.GetLinkedLogWhenError(exception);
        }
    }
}