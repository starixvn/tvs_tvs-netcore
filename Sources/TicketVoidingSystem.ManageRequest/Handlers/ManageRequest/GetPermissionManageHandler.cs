using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

using Fanex.NAP.Client.Helpers.Business;

public class GetPermissionManageRequest : IRequest<PermissionManage>
{
}

public class GetPermissionManageHandler(SessionService sessionService)
    : IRequestHandler<GetPermissionManageRequest, PermissionManage>
{
    public async Task<PermissionManage> Handle(GetPermissionManageRequest request, CancellationToken cancellationToken)
    {
        var manageRequestHost =
            sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingManageRequest, Constant.Policy.Host);
        var verifyRead =
            sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVerifyRequest, Constant.Policy.Read);
        var verifyHost =
            sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVerifyRequest, Constant.Policy.Host);
        var voidRead =
            sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVoidTickets, Constant.Policy.Read);
        var isReadMarkTickets =
            sessionService.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Read);
        var permissionTasks = new List<Task<bool>>
        {
            manageRequestHost, verifyRead, verifyHost, voidRead, isReadMarkTickets
        };

        await Task.WhenAll(permissionTasks);

        return new PermissionManage
        {
            ManageRequestHost = await manageRequestHost,
            VerifyRead = await verifyRead,
            VerifyHost = await verifyHost,
            VoidRead = await voidRead,
            IsReadMarkTickets = await isReadMarkTickets
        };
    }
}