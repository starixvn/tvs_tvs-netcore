using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetChildMatchesEKORequest : GetRelatedMatchCriteria, IRequest<IEnumerable<Match>>
{
}

public class GetChildMatchesEKORequestHandler : IRequestHandler<GetChildMatchesEKORequest, IEnumerable<Match>>
{
    private readonly IDynamicRepository repository;
    private readonly MatchService matchService;

    public GetChildMatchesEKORequestHandler(IDynamicRepository repository, MatchService matchService)
    {
        this.repository = repository;
        this.matchService = matchService;
    }

    public async Task<IEnumerable<Match>> Handle(GetChildMatchesEKORequest request, CancellationToken cancellationToken)
    {
        var matches = await repository.FetchAsync<Match>(request);
        return matches.Select(matchService.UpdateMatchInfoFromRemotingRef);
    }
}