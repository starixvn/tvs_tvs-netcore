using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetChildMatchesInfoRequest : GetRelatedMatchCriteria, IRequest<IEnumerable<Match>>
{
}

public class GetChildMatchesInfoRequestHandler : IRequestHandler<GetChildMatchesInfoRequest, IEnumerable<Match>>
{
    private readonly IDynamicRepository repository;
    private readonly MatchService matchService;

    public GetChildMatchesInfoRequestHandler(IDynamicRepository repository, MatchService matchService)
    {
        this.repository = repository;
        this.matchService = matchService;
    }

    public async Task<IEnumerable<Match>> Handle(GetChildMatchesInfoRequest request, CancellationToken cancellationToken)
    {
        var matches = await repository.FetchAsync<Match>(request, cancellationToken);
        return matches.Select(matchService.UpdateMatchInfoFromRemotingRef);
    }
}