using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetChildMatchesEKORequest : GetRelatedMatchCriteria, IRequest<IEnumerable<Match>>;

public class GetChildMatchesEKORequestHandler(IDynamicRepository repository, MatchService matchService)
    : IRequestHandler<GetChildMatchesEKORequest, IEnumerable<Match>>
{
    public async Task<IEnumerable<Match>> Handle(GetChildMatchesEKORequest request, CancellationToken cancellationToken)
    {
        var matches = await repository.FetchAsync<Match>(request);
        return matches.Select(matchService.UpdateMatchInfoFromRemotingRef);
    }
}