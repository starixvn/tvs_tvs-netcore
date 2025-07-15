using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.ViewModels;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class GetSubIssueTypeRequest : IRequest<IssueTypesViewModel>
{
    public int IssueTypeId { get; set; }
}

public class GetSubIssueTypeHandler(IDynamicRepository repository)
    : IRequestHandler<GetSubIssueTypeRequest, IssueTypesViewModel>
{
    public async Task<IssueTypesViewModel> Handle(GetSubIssueTypeRequest request,
        CancellationToken cancellationToken)
    {
        var issueTypes = await repository.FetchAsync<IssueType>(new GetIssueTypeCriteria());
        var subIssueTypes = await repository.FetchAsync<SubIssueType>(new GetSubIssueTypeCriteria());

        return new IssueTypesViewModel
        {
            IssueTypes = issueTypes.Where(x => x.IssueTypeId == request.IssueTypeId),
            SubIssueTypes = subIssueTypes.Where(x => x.IssueTypeId == request.IssueTypeId)
        };
    }
}