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
        var permissionTasks = new List<Task<bool>>()
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
            ManageRequestHost = permissionTasks[0].Result,
            VerifyRead = permissionTasks[1].Result,
            VerifyHost = permissionTasks[2].Result,
            VoidRead = permissionTasks[3].Result,
            ManageRequestUnsettledTicketsHost = permissionTasks[4].Result,
            ManageRequestSettledTicketsHost = permissionTasks[5].Result,
            IsReadMarkTickets = permissionTasks[6].Result
        };
    }
}