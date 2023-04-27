using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class GetIssueNameRequest : IRequest<IssueInfo>
{
    public int SubId { get; init; }
}

public class GetIssueNameHandler : IRequestHandler<GetIssueNameRequest, IssueInfo>
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;

    public GetIssueNameHandler(IMapper mapper, IDynamicRepository repository)
    {
        this.mapper = mapper;
        this.repository = repository;
    }

    public async Task<IssueInfo> Handle(GetIssueNameRequest request, CancellationToken cancellationToken)
    {
        var issueTypes = await repository.FetchAsync<IssueType>(new GetIssueTypeCriteria());
        var subIssueTypes = await repository.FetchAsync<SubIssueType>(new GetSubIssueTypeCriteria());
        var sub = subIssueTypes.FirstOrDefault(x => x.SubIssueTypeId == request.SubId);
        var issue = issueTypes.FirstOrDefault(x => x.IssueTypeId == sub?.IssueTypeId);
        var result = mapper.Map<IssueInfo>(sub) ?? new IssueInfo();
        result.Name = issue?.IssueTypeName;

        return result;
    }
}