using Fanex.NAP.Core.Business;
using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class GetPermissionManageRequest : IRequest<PermissionManage>
{
}

public class GetPermissionManageHandler : IRequestHandler<GetPermissionManageRequest, PermissionManage>
{
    private readonly SessionService sessionService;

    public GetPermissionManageHandler(SessionService sessionService)
    {
        this.sessionService = sessionService;
    }

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
        var manageRequestUnsettledTicketsHost =
            sessionService.HasPermission(SpecialDeleteFunctionKeys.UnsettledTickets, Constant.Policy.Host);
        var manageRequestSettledTicketsHost =
            sessionService.HasPermission(SpecialDeleteFunctionKeys.SettledTickets, Constant.Policy.Host);
        var isReadMarkTickets =
            sessionService.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Read);
        var permissionTasks = new List<Task<bool>>
        {
            manageRequestHost, verifyRead, verifyHost, voidRead, manageRequestUnsettledTicketsHost, manageRequestSettledTicketsHost, isReadMarkTickets
        };

        await Task.WhenAll(permissionTasks);

        return new PermissionManage
        {
            ManageRequestHost = await manageRequestHost,
            VerifyRead = await verifyRead,
            VerifyHost = await verifyHost,
            VoidRead = await voidRead,
            ManageRequestUnsettledTicketsHost = await manageRequestUnsettledTicketsHost,
            ManageRequestSettledTicketsHost = await manageRequestSettledTicketsHost,
            IsReadMarkTickets = await isReadMarkTickets
        };
    }
}