using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetSubIssueTypeLinkMatchRequest : GetSubIssueTypeLinkMatchCriteria, IRequest<IEnumerable<SubIssueTypeLinkMatch>>;

public class GetSubIssueTypeLinkMatchHandler(IDynamicRepository repository)
    : IRequestHandler<GetSubIssueTypeLinkMatchRequest, IEnumerable<SubIssueTypeLinkMatch>>
{
    public async Task<IEnumerable<SubIssueTypeLinkMatch>> Handle(GetSubIssueTypeLinkMatchRequest request, CancellationToken cancellationToken)
    {
        return await repository.FetchAsync<SubIssueTypeLinkMatch>(request);
    }
}