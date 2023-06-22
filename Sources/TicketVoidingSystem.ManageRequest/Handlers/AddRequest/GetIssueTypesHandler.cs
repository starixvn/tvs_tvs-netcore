using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetIssueTypesRequest : IRequest<IssueTypesViewModel>
{
}

public class GetIssueTypesHandler : IRequestHandler<GetIssueTypesRequest, IssueTypesViewModel>
{
    private readonly IDynamicRepository repository;

    public GetIssueTypesHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IssueTypesViewModel> Handle(GetIssueTypesRequest request, CancellationToken cancellationToken)
    {
        var issueTypes = await repository.FetchAsync<IssueType>(new GetIssueTypeCriteria(), cancellationToken);
        var subIssueTypes = await repository.FetchAsync<SubIssueType>(new GetSubIssueTypeCriteria(), cancellationToken);

        return new IssueTypesViewModel
        {
            IssueTypes = issueTypes,
            SubIssueTypes = subIssueTypes
        };
    }
}