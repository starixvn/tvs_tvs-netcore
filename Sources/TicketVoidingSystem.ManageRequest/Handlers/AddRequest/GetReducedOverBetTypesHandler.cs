using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetReducedOverBetTypesRequest : IRequest<IEnumerable<ReducedOverBetTypesModel>>
{
    public int MatchId { get; set; }
}

public class GetReducedOverBetTypesHandler : IRequestHandler<GetReducedOverBetTypesRequest, IEnumerable<ReducedOverBetTypesModel>>
{
    private readonly ReducedOverBetTypesService reducedOverBetTypesService;

    public GetReducedOverBetTypesHandler(ReducedOverBetTypesService reducedOverBetTypesService)
    {
        this.reducedOverBetTypesService = reducedOverBetTypesService;
    }

    public async Task<IEnumerable<ReducedOverBetTypesModel>> Handle(GetReducedOverBetTypesRequest request, CancellationToken cancellationToken)
    {
        return await reducedOverBetTypesService.GetBetTypes(request.MatchId);
    }
}