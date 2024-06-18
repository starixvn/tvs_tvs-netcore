using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetSubIssueTypeLinkMatchRequest : GetSubIssueTypeLinkMatchCriteria, IRequest<IEnumerable<SubIssueTypeLinkMatch>>
{
}

public class GetSubIssueTypeLinkMatchHandler : IRequestHandler<GetSubIssueTypeLinkMatchRequest, IEnumerable<SubIssueTypeLinkMatch>>
{
    private readonly IDynamicRepository repository;

    public GetSubIssueTypeLinkMatchHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<SubIssueTypeLinkMatch>> Handle(GetSubIssueTypeLinkMatchRequest request, CancellationToken cancellationToken)
    {
        return await repository.FetchAsync<SubIssueTypeLinkMatch>(request);
    }
}