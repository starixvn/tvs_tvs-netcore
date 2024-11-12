using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.ManageVoidServices.Handlers;

public class UpdateVoidingHistoryRequest : IRequest<bool>
{
    public int VoidingHistoryId { get; set; }
    public int StatusId { get; set; }
}

public class UpdateVoidingHistoryHandler(VoidingHistoryService voidingHistoryService)
    : IRequestHandler<UpdateVoidingHistoryRequest, bool>
{
    public async Task<bool> Handle(UpdateVoidingHistoryRequest request, CancellationToken cancellationToken)
    {
        await voidingHistoryService.UpdateVoidingHistory(request.VoidingHistoryId, request.StatusId);
        return true;
    }
}