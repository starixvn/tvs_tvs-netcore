using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetNotParticipateBetTypesRequest : IRequest<IEnumerable<NotParticipateBetTypesModel>>
{
    public int MatchId { get; set; }
}

public class GetNotParticipateBetTypesHandler : IRequestHandler<GetNotParticipateBetTypesRequest, IEnumerable<NotParticipateBetTypesModel>>
{
    private readonly NotParticipateBetTypesService notParticipateBetTypesService;

    public GetNotParticipateBetTypesHandler(NotParticipateBetTypesService notParticipateBetTypesService)
    {
        this.notParticipateBetTypesService = notParticipateBetTypesService;
    }

    public async Task<IEnumerable<NotParticipateBetTypesModel>> Handle(GetNotParticipateBetTypesRequest request, CancellationToken cancellationToken)
    {
        return await notParticipateBetTypesService.GetBetTypes(request.MatchId);
    }
}