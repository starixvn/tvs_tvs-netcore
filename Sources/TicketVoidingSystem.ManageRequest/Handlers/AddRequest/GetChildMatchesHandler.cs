using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetChildMatchesRequest : GetRelatedMatchCriteria, IRequest<IEnumerable<MatchInfoAddRequest>>;

public class GetChildMatchesHandler(
    IDynamicRepository repository,
    MatchInfoAddRequestService matchInfoAddRequestService)
    : IRequestHandler<GetChildMatchesRequest, IEnumerable<MatchInfoAddRequest>>
{
    public async Task<IEnumerable<MatchInfoAddRequest>> Handle(GetChildMatchesRequest request, CancellationToken cancellationToken)
    {
        var matches = await repository.FetchAsync<MatchInfoAddRequest>(request);
        return matchInfoAddRequestService.UpdateDataFromRemotingRef(matches);
    }
}