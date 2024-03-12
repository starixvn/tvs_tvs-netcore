using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetPermissionRequest : IRequest<PermissionAddRequest>
{
}

public class GetPermissionHandler : IRequestHandler<GetPermissionRequest, PermissionAddRequest>
{
    private readonly SessionService sessionService;

    public GetPermissionHandler(SessionService sessionService)
    {
        this.sessionService = sessionService;
    }

    public async Task<PermissionAddRequest> Handle(GetPermissionRequest request, CancellationToken cancellationToken)
    {
        return new PermissionAddRequest
        {
            IsVoidAllArchivedTickets =
                await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidAllArchivedTickets, Constant.Policy.Host)
        };
    }
}