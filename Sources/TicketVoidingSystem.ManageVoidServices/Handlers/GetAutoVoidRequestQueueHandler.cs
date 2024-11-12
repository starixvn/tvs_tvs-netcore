using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.ManageVoidServices.Handlers;

public class GetAutoVoidRequestQueueRequest : IRequest<IEnumerable<AutoVoidRequestQueueModel>>
{
    public string BroadcastSessionId { get; set; }
    public int? StatusId { get; set; }
}

public class GetAutoVoidRequestQueueHandler(AutoVoidRequestQueueService autoVoidRequestQueueService)
    : IRequestHandler<GetAutoVoidRequestQueueRequest, IEnumerable<AutoVoidRequestQueueModel>>
{
    public async Task<IEnumerable<AutoVoidRequestQueueModel>> Handle(GetAutoVoidRequestQueueRequest request, CancellationToken cancellationToken)
    {
        return await autoVoidRequestQueueService.GetQueueInAllServers(request.BroadcastSessionId, request.StatusId);
    }
}