using MediatR;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetNotParticipateBetTypesRequest : IRequest<NotParticipateBetTypesViewModel>
{
    public int MatchId { get; set; }
}

public class GetNotParticipateBetTypesHandler(NotParticipateBetTypesService notParticipateBetTypesService)
    : IRequestHandler<GetNotParticipateBetTypesRequest, NotParticipateBetTypesViewModel>
{
    public async Task<NotParticipateBetTypesViewModel> Handle(GetNotParticipateBetTypesRequest request, CancellationToken cancellationToken)
    {
        return await notParticipateBetTypesService.GetNotParticipateBetType(request.MatchId);
    }
}