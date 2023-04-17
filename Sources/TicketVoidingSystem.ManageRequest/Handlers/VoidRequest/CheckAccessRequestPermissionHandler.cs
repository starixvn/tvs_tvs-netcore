using MediatR;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;

public class CheckAccessRequestPermissionRequest : IRequest<bool>
{
    public int RequestId { get; set; }
}

public class CheckAccessRequestPermissionHandler : IRequestHandler<CheckAccessRequestPermissionRequest, bool>
{
    private readonly CheckPermissionOnRequestService checkPermissionOnRequestService;

    public CheckAccessRequestPermissionHandler(CheckPermissionOnRequestService checkPermissionOnRequestService)
    {
        this.checkPermissionOnRequestService = checkPermissionOnRequestService;
    }

    public async Task<bool> Handle(CheckAccessRequestPermissionRequest request, CancellationToken cancellationToken)
    {
        var isHasPermission = await checkPermissionOnRequestService.IsHasPermissionOnRequest(request.RequestId);

        return isHasPermission;
    }
}