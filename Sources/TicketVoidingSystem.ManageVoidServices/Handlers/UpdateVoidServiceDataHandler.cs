using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.ManageVoidServices.Handlers;

public class UpdateVoidServiceDataRequest : IRequest<bool>
{
    public int SiteDbGroupId { get; set; }
    public int RequestId { get; set; }
    public int VoidingHistoryId { get; set; }
    public int StatusId { get; set; }
}

public class UpdateVoidServiceDataHandler : IRequestHandler<UpdateVoidServiceDataRequest, bool>
{
    private readonly CheckingVoidStatusService checkingVoidStatusService;

    public UpdateVoidServiceDataHandler(CheckingVoidStatusService checkingVoidStatusService)
    {
        this.checkingVoidStatusService = checkingVoidStatusService;
    }

    public async Task<bool> Handle(UpdateVoidServiceDataRequest request, CancellationToken cancellationToken)
    {
        await checkingVoidStatusService.UpdateVoidService(request.SiteDbGroupId, request.RequestId,
            request.VoidingHistoryId, request.StatusId);
        return true;
    }
}