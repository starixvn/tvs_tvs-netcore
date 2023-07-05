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
            ManageRequestHost = await permissionTasks[PermissionTasks.ManageRequestHost],
            VerifyRead = await permissionTasks[PermissionTasks.VerifyRead],
            VerifyHost = await permissionTasks[PermissionTasks.VerifyHost],
            VoidRead = await permissionTasks[PermissionTasks.VoidRead],
            ManageRequestUnsettledTicketsHost = await permissionTasks[PermissionTasks.ManageRequestUnsettledTicketsHost],
            ManageRequestSettledTicketsHost = await permissionTasks[PermissionTasks.ManageRequestSettledTicketsHost],
            IsReadMarkTickets = await permissionTasks[PermissionTasks.IsReadMarkTickets]
        };
    }

    public static class PermissionTasks
    {
        public const int ManageRequestHost = 0;
        public const int VerifyRead = 1;
        public const int VerifyHost = 2;
        public const int VoidRead = 3;
        public const int ManageRequestUnsettledTicketsHost = 4;
        public const int ManageRequestSettledTicketsHost = 5;
        public const int IsReadMarkTickets = 5;
    }
}