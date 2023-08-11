using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetChildMatchesRequest : GetRelatedMatchCriteria, IRequest<IEnumerable<MatchInfoAddRequest>>
{
}

public class GetChildMatchesHandler : IRequestHandler<GetChildMatchesRequest, IEnumerable<MatchInfoAddRequest>>
{
    private readonly IDynamicRepository repository;
    private readonly MatchInfoAddRequestService matchInfoAddRequestService;

    public GetChildMatchesHandler(IDynamicRepository repository, MatchInfoAddRequestService matchInfoAddRequestService)
    {
        this.repository = repository;
        this.matchInfoAddRequestService = matchInfoAddRequestService;
    }

    public async Task<IEnumerable<MatchInfoAddRequest>> Handle(GetChildMatchesRequest request, CancellationToken cancellationToken)
    {
        var matches = await repository.FetchAsync<MatchInfoAddRequest>(request, cancellationToken);
        return matchInfoAddRequestService.UpdateDataFromRemotingRef(matches);
    }
}