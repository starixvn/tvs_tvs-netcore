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
        var permissionTasks = new List<Task<bool>>
        {
            sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingManageRequest, Constant.Policy.Host),
            sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVerifyRequest, Constant.Policy.Read),
            sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVerifyRequest, Constant.Policy.Host),
            sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVoidTickets, Constant.Policy.Read),
            sessionService.HasPermission(SpecialDeleteFunctionKeys.UnsettledTickets, Constant.Policy.Host),
            sessionService.HasPermission(SpecialDeleteFunctionKeys.SettledTickets, Constant.Policy.Host),
            sessionService.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Read)
        };

        await Task.WhenAll(permissionTasks);

        return new PermissionManage
        {
            ManageRequestHost = await permissionTasks[0],
            VerifyRead = await permissionTasks[1],
            VerifyHost = await permissionTasks[2],
            VoidRead = await permissionTasks[3],
            ManageRequestUnsettledTicketsHost = await permissionTasks[4],
            ManageRequestSettledTicketsHost = await permissionTasks[5],
            IsReadMarkTickets = await permissionTasks[6]
        };
    }
}