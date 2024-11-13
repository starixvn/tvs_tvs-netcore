using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ABExceptionList.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ABExceptionList.Handlers;

using Fanex.NAP.Client.Helpers.Business;

public class GetPermissionRequest : IRequest<PermissionABExceptionList>;

public class GetPermissionHandler(SessionService session)
    : IRequestHandler<GetPermissionRequest, PermissionABExceptionList>
{
    public async Task<PermissionABExceptionList> Handle(GetPermissionRequest request, CancellationToken cancellationToken)
    {
        var permission = new PermissionABExceptionList
        {
            ABExceptionListHost = await session.HasPermission(SpecialDeleteFunctionKeys.ABExceptionList, Constant.Policy.Host)
        };
        return permission;
    }
}