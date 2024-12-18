using MediatR;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;

public class CheckAccessRequestPermissionRequest : IRequest<bool>
{
    public int RequestId { get; set; }
}

public class CheckAccessRequestPermissionHandler(CheckPermissionOnRequestService checkPermissionOnRequestService)
    : IRequestHandler<CheckAccessRequestPermissionRequest, bool>
{
    public async Task<bool> Handle(CheckAccessRequestPermissionRequest request, CancellationToken cancellationToken)
    {
        var isHasPermission = await checkPermissionOnRequestService.IsHasPermissionOnRequest(request.RequestId);

        return isHasPermission;
    }
}