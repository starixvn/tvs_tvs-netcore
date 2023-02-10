using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.ManageVoidServices.Handlers;

public class GetVoidingHistoryRequest : IRequest<IEnumerable<VoidingHistoryModel>>
{
    public int RequestId { get; set; }
}

public class GetVoidingHistoryHandler : IRequestHandler<GetVoidingHistoryRequest, IEnumerable<VoidingHistoryModel>>
{
    private readonly VoidingHistoryService voidingHistoryService;

    public GetVoidingHistoryHandler(VoidingHistoryService voidingHistoryService)
    {
        this.voidingHistoryService = voidingHistoryService;
    }

    public async Task<IEnumerable<VoidingHistoryModel>> Handle(GetVoidingHistoryRequest request, CancellationToken cancellationToken)
    {
        return await voidingHistoryService.GetByRequestId(request.RequestId);
    }
}