using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.ManageVoidServices.Handlers;

public class GetLetstalkRequest : IRequest<IEnumerable<LetstalkModel>>
{
    public string BroadcastSessionId { get; set; }
    public int RequestId { get; set; }
}

public class GetLetstalkHandler : IRequestHandler<GetLetstalkRequest, IEnumerable<LetstalkModel>>
{
    private readonly LetstalkService letstalkService;

    public GetLetstalkHandler(LetstalkService letstalkService)
    {
        this.letstalkService = letstalkService;
    }

    public async Task<IEnumerable<LetstalkModel>> Handle(GetLetstalkRequest request, CancellationToken cancellationToken)
    {
        return await letstalkService.GetLetstalkModel(request.RequestId, request.BroadcastSessionId);
    }
}