using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetSubIssueTypeNoteRequest : GetSubIssueTypeNoteCriteria, IRequest<IEnumerable<SubIssueTypeNoteModel>>
{
}

public class GetSubIssueTypeNoteHandler : IRequestHandler<GetSubIssueTypeNoteRequest, IEnumerable<SubIssueTypeNoteModel>>
{
    private readonly IDynamicRepository repository;

    public GetSubIssueTypeNoteHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<SubIssueTypeNoteModel>> Handle(GetSubIssueTypeNoteRequest request, CancellationToken cancellationToken)
    {
        return await repository.FetchAsync<SubIssueTypeNoteModel>(request);
    }
}