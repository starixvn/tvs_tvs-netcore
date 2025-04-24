using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetChildMatchesRequest : GetRelatedMatchCriteria, IRequest<IEnumerable<Match>>;

public class GetChildMatchesHandler(
    IDynamicRepository repository,
    MatchService matchService)
    : IRequestHandler<GetChildMatchesRequest, IEnumerable<Match>>
{
    public async Task<IEnumerable<Match>> Handle(GetChildMatchesRequest request, CancellationToken cancellationToken)
    {
        var matches = await repository.FetchAsync<Match>(request);
        foreach (var match in matches)
        {
            matchService.UpdateMatchInfoFromRemotingRef(match);
        }

        return matches;
    }
}