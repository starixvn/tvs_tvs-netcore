using System.Threading;
using System.Threading.Tasks;
using Fanex.NAP.Core.Business;
using MediatR;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.MarkTickets.Handlers
{
    public class GetDataPermissionRequest : IRequest<DataPermission>
    {
    }

    public class GetDataPermissionHandler : IRequestHandler<GetDataPermissionRequest, DataPermission>
    {
        private readonly SessionService sessionService;

        public GetDataPermissionHandler(SessionService sessionService)
        {
            this.sessionService = sessionService;
        }

        public async Task<DataPermission> Handle(GetDataPermissionRequest request, CancellationToken cancellationToken)
        {
            return await Task.FromResult(new DataPermission
            {
                IsReadMarkTickets = sessionService.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Read),
                IsHostMarkTickets = sessionService.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Host)
            });
        }
    }
}