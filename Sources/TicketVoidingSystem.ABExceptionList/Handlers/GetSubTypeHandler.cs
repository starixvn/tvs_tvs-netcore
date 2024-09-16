using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.ABExceptionList.Models;
using TicketVoidingSystem.Constants;

namespace TicketVoidingSystem.ABExceptionList.Handlers;

public class GetSubTypeRequest : GetSubTypeCriteria, IRequest<IEnumerable<AbExceptionSubTypeViewModel>>
{
}

public class GetSubTypeHandler : IRequestHandler<GetSubTypeRequest, IEnumerable<AbExceptionSubTypeViewModel>>
{
    private readonly IDynamicRepository repository;

    public GetSubTypeHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<AbExceptionSubTypeViewModel>> Handle(GetSubTypeRequest request, CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<AbExceptionSubTypeViewModel>(request);

        return results.Where(x => !SubIssueTypeConstant.RemovedList.Contains(int.Parse(x.SubIssueTypeIds)));
    }
}