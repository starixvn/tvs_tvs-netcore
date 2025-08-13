using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetPermissionRequest : IRequest<PermissionAddRequest>;

public class GetPermissionHandler(SessionService sessionService)
    : IRequestHandler<GetPermissionRequest, PermissionAddRequest>
{
    public async Task<PermissionAddRequest> Handle(GetPermissionRequest request, CancellationToken cancellationToken)
    {
        return new PermissionAddRequest
        {
            IsVoidAllArchivedTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidAllArchivedTickets, Constant.Policy.Host),
            IsAddSettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.SettledTickets, Constant.Policy.Host),
            IsAddInstantlySettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.InstantlySettledTickets, Constant.Policy.Host)
        };
    }
}