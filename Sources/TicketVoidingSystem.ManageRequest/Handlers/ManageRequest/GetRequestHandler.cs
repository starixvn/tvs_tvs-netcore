using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class GetRequestRequest : GetRequestCriteria, IRequest<RequestDetailViewModel>;

public class GetRequestHandler(GetRequestService getRequestService, LoggingService loggingService)
    : IRequestHandler<GetRequestRequest, RequestDetailViewModel>
{
    public async Task<RequestDetailViewModel> Handle(GetRequestRequest request, CancellationToken cancellationToken)
    {
        try
        {
            return await getRequestService.GetRequest(request);
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync(e);
            return null;
        }
    }
}