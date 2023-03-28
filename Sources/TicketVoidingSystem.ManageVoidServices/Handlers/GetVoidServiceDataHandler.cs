using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.ManageVoidServices.Handlers;

public class GetVoidServiceDataRequest : IRequest<IEnumerable<VoidServiceModel>>
{
    public string BroadcastSessionId { get; set; }
    public int? RequestId { get; set; }
}

public class GetVoidServiceDataHandler : IRequestHandler<GetVoidServiceDataRequest, IEnumerable<VoidServiceModel>>
{
    private readonly CheckingVoidStatusService checkingVoidStatusService;

    public GetVoidServiceDataHandler(CheckingVoidStatusService checkingVoidStatusService)
    {
        this.checkingVoidStatusService = checkingVoidStatusService;
    }

    public async Task<IEnumerable<VoidServiceModel>> Handle(GetVoidServiceDataRequest request, CancellationToken cancellationToken)
    {
        return await checkingVoidStatusService.GetVoidServiceData(request.BroadcastSessionId, request.RequestId);
    }
}