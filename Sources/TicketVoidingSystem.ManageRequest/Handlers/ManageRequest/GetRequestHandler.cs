using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class GetRequestRequest : GetRequestCriteria, IRequest<RequestDetailViewModel>
{
}

public class GetRequestHandler : IRequestHandler<GetRequestRequest, RequestDetailViewModel>
{
    private readonly GetRequestService getRequestService;

    public GetRequestHandler(GetRequestService getRequestService)
    {
        this.getRequestService = getRequestService;
    }

    public async Task<RequestDetailViewModel> Handle(GetRequestRequest request, CancellationToken cancellationToken)
    {
        return await getRequestService.GetRequest(request);
    }
}