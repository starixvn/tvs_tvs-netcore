using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.ABExceptionList.Models;

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
        return await repository.FetchAsync<AbExceptionSubTypeViewModel>(request, cancellationToken);
    }
}