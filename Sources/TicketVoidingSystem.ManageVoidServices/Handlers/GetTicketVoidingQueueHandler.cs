using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.ManageVoidServices.Handlers;

public class GetTicketVoidingQueueRequest : IRequest<IEnumerable<TicketVoidingQueueModel>>
{
    public int VoidingHistoryId { get; set; }
}

public class GetTicketVoidingQueueHandler(TicketVoidingQueueService ticketVoidingQueueService)
    : IRequestHandler<GetTicketVoidingQueueRequest, IEnumerable<TicketVoidingQueueModel>>
{
    public async Task<IEnumerable<TicketVoidingQueueModel>> Handle(GetTicketVoidingQueueRequest request, CancellationToken cancellationToken)
    {
        return await ticketVoidingQueueService.GetQueueInAllServers(request.VoidingHistoryId);
    }
}