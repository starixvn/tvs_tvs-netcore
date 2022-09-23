using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.ManageVoidServices.Handlers
{
    public class GetTicketVoidingQueueRequest : IRequest<IEnumerable<TicketVoidingQueueModel>>
    {
        public int VoidingHistoryId { get; set; }
    }

    public class GetTicketVoidingQueueHandler : IRequestHandler<GetTicketVoidingQueueRequest, IEnumerable<TicketVoidingQueueModel>>
    {
        private readonly TicketVoidingQueueService ticketVoidingQueueService;

        public GetTicketVoidingQueueHandler(TicketVoidingQueueService ticketVoidingQueueService)
        {
            this.ticketVoidingQueueService = ticketVoidingQueueService;
        }

        public async Task<IEnumerable<TicketVoidingQueueModel>> Handle(GetTicketVoidingQueueRequest request, CancellationToken cancellationToken)
        {
            return await ticketVoidingQueueService.GetQueueInAllServers(request.VoidingHistoryId);
        }
    }
}