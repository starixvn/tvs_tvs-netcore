using System.Threading;
using System.Threading.Tasks;
using Fanex.NAP.Core.Business;
using MediatR;
using TicketVoidingSystem.ABExceptionList.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ABExceptionList.Handlers
{
    public class GetPermissionRequest : IRequest<PermissionABExceptionList>
    {
    }

    public class GetPermissionHandler : IRequestHandler<GetPermissionRequest, PermissionABExceptionList>
    {
        private readonly SessionService session;

        public GetPermissionHandler(SessionService session)
        {
            this.session = session;
        }

        public Task<PermissionABExceptionList> Handle(GetPermissionRequest request, CancellationToken cancellationToken)
        {
            var permission = new PermissionABExceptionList
            {
                ABExceptionListHost = session.HasPermission(SpecialDeleteFunctionKeys.ABExceptionList, Constant.Policy.Host),
            };
            return Task.FromResult(permission);
        }
    }
}