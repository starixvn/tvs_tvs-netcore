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
        // Jacob: Có phiên bản async đó. Xài kết hợp Task.WhenAll để gọi song song. 
        // Kết hợp linq để code cho gọn
        return await Task.FromResult(new PermissionManage
        {
            ManageRequestHost = sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingManageRequest, Constant.Policy.Host),
            VerifyRead = sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVerifyRequest, Constant.Policy.Read),
            VerifyHost = sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVerifyRequest, Constant.Policy.Host),
            VoidRead = sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingVoidTickets, Constant.Policy.Read),
            ManageRequestUnsettledTicketsHost = sessionService.HasPermission(SpecialDeleteFunctionKeys.UnsettledTickets, Constant.Policy.Host),
            ManageRequestSettledTicketsHost = sessionService.HasPermission(SpecialDeleteFunctionKeys.SettledTickets, Constant.Policy.Host),
            IsReadMarkTickets = sessionService.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Read),
        });
    }
}