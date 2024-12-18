using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.ManageVoidServices.Handlers;

public class UpdateLetstalkRequest : IRequest<bool>
{
    public string BroadcastSessionId { get; set; }
    public int RequestId { get; set; }
    public int StatusId { get; set; }
}

public class UpdateLetstalkHandler(LetstalkService letstalkService) : IRequestHandler<UpdateLetstalkRequest, bool>
{
    public async Task<bool> Handle(UpdateLetstalkRequest request, CancellationToken cancellationToken)
    {
        await letstalkService.UpdateLetstalk(request.RequestId, request.BroadcastSessionId, request.StatusId);
        return true;
    }
}