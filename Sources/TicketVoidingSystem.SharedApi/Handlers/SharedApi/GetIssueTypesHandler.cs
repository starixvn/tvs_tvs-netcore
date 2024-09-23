using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.ViewModels;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

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
        var issueTypes = await repository.FetchAsync<IssueType>(new GetIssueTypeCriteria());
        var subIssueTypes = await repository.FetchAsync<SubIssueType>(new GetSubIssueTypeCriteria());
        subIssueTypes = subIssueTypes.Where(x => !SubIssueTypeConstant.RemovedList.Contains(x.SubIssueTypeId));

        return new IssueTypesViewModel
        {
            IssueTypes = issueTypes.ToList(),
            SubIssueTypes = subIssueTypes.ToList()
        };
    }
}