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

public class GetVoidingHistoryHandler(VoidingHistoryService voidingHistoryService)
    : IRequestHandler<GetVoidingHistoryRequest, IEnumerable<VoidingHistoryModel>>
{
    public async Task<IEnumerable<VoidingHistoryModel>> Handle(GetVoidingHistoryRequest request, CancellationToken cancellationToken)
    {
        return await voidingHistoryService.GetByRequestId(request.RequestId);
    }
}