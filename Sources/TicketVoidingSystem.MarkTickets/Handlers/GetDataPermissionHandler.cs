using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.MarkTickets.Handlers;

using Fanex.NAP.Client.Helpers.Business;

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
        return new DataPermission
        {
            IsReadMarkTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Read),
            IsHostMarkTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Host)
        };
    }
}