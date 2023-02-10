using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.ManageVoidServices.Handlers;

public class UpdateTicketVoidingQueueRequest : IRequest<bool>
{
    public int SiteDbGroupId { get; set; }
    public string QueueIds { get; set; }
    public int StatusId { get; set; }
}

public class UpdateTicketVoidingQueueHandler : IRequestHandler<UpdateTicketVoidingQueueRequest, bool>
{
    private readonly TicketVoidingQueueService ticketVoidingQueueService;

    public UpdateTicketVoidingQueueHandler(TicketVoidingQueueService ticketVoidingQueueService)
    {
        this.ticketVoidingQueueService = ticketVoidingQueueService;
    }

    public async Task<bool> Handle(UpdateTicketVoidingQueueRequest request, CancellationToken cancellationToken)
    {
        await ticketVoidingQueueService.UpdateQueueByBatch(request.SiteDbGroupId, request.QueueIds,
            request.StatusId);
        return true;
    }
}