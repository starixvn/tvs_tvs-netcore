using MediatR;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetReducedOverBetTypesRequest : IRequest<IEnumerable<ReducedOverBetTypesModel>>
{
    public int MatchId { get; set; }
}

public class GetReducedOverBetTypesHandler(ReducedOverBetTypesService reducedOverBetTypesService)
    : IRequestHandler<GetReducedOverBetTypesRequest, IEnumerable<ReducedOverBetTypesModel>>
{
    public async Task<IEnumerable<ReducedOverBetTypesModel>> Handle(GetReducedOverBetTypesRequest request, CancellationToken cancellationToken)
    {
        return await reducedOverBetTypesService.GetBetTypes(request.MatchId);
    }
}