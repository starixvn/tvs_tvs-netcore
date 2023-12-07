using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetNotParticipateBetTypesRequest : IRequest<NotParticipateBetTypesViewModel>
{
    public int MatchId { get; set; }
}

public class GetNotParticipateBetTypesHandler : IRequestHandler<GetNotParticipateBetTypesRequest, NotParticipateBetTypesViewModel>
{
    private readonly NotParticipateBetTypesService notParticipateBetTypesService;

    public GetNotParticipateBetTypesHandler(NotParticipateBetTypesService notParticipateBetTypesService)
    {
        this.notParticipateBetTypesService = notParticipateBetTypesService;
    }

    public async Task<NotParticipateBetTypesViewModel> Handle(GetNotParticipateBetTypesRequest request, CancellationToken cancellationToken)
    {
        return await notParticipateBetTypesService.GetNotParticipateBetType(request.MatchId);
    }
}