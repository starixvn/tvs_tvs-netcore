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

public class UpdateVoidingHistoryHandler : IRequestHandler<UpdateVoidingHistoryRequest, bool>
{
    private readonly VoidingHistoryService voidingHistoryService;

    public UpdateVoidingHistoryHandler(VoidingHistoryService voidingHistoryService)
    {
        this.voidingHistoryService = voidingHistoryService;
    }

    public async Task<bool> Handle(UpdateVoidingHistoryRequest request, CancellationToken cancellationToken)
    {
        await voidingHistoryService.UpdateVoidingHistory(request.VoidingHistoryId, request.StatusId);

        return true;
    }
}