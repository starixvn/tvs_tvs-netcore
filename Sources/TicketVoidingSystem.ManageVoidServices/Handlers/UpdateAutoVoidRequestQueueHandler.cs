using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.ManageVoidServices.Handlers;

public class UpdateAutoVoidRequestQueueRequest : IRequest<bool>
{
    public int SiteDbGroupId { get; set; }
    public int QueueId { get; set; }
    public int StatusId { get; set; }
}

public class UpdateAutoVoidRequestQueueHandler(AutoVoidRequestQueueService autoVoidRequestQueueService)
    : IRequestHandler<UpdateAutoVoidRequestQueueRequest, bool>
{
    public async Task<bool> Handle(UpdateAutoVoidRequestQueueRequest request, CancellationToken cancellationToken)
    {
        await autoVoidRequestQueueService.UpdateQueue(request.SiteDbGroupId, request.QueueId, null, request.StatusId, null, null);
        return true;
    }
}