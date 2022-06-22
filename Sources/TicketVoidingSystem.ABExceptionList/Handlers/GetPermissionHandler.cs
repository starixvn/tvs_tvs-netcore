using System.Threading;
using System.Threading.Tasks;
using Fanex.NAP.Core.Business;
using MediatR;
using TicketVoidingSystem.ABExceptionList.Models;
using TicketVoidingSystem.Core.Services;
using TicketVoidingSystem.Core.Web;

namespace TicketVoidingSystem.ABExceptionList.Handlers
{
    public class GetPermissionRequest : IRequest<PermissionABWhiteList>
    {
    }

    public class GetPermissionHandler : IRequestHandler<GetPermissionRequest, PermissionABWhiteList>
    {
        private readonly SessionService session;

        public GetPermissionHandler(SessionService session)
        {
            this.session = session;
        }

        public Task<PermissionABWhiteList> Handle(GetPermissionRequest request, CancellationToken cancellationToken)
        {
            var permission = new PermissionABWhiteList
            {
                ABWhiteListHost = session.HasPermission(SpecialDeleteFunctionKeys.ABExceptionList, Constant.Policy.Host),
            };
            return Task.FromResult(permission);
        }
    }
}