using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetSubIssueTypeNoteRequest : GetSubIssueTypeNoteCriteria, IRequest<IEnumerable<SubIssueTypeNoteModel>>;

public class GetSubIssueTypeNoteHandler(IDynamicRepository repository)
    : IRequestHandler<GetSubIssueTypeNoteRequest, IEnumerable<SubIssueTypeNoteModel>>
{
    public async Task<IEnumerable<SubIssueTypeNoteModel>> Handle(GetSubIssueTypeNoteRequest request, CancellationToken cancellationToken)
    {
        return await repository.FetchAsync<SubIssueTypeNoteModel>(request);
    }
}